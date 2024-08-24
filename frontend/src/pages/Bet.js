import React, {useState, useEffect, useCallback} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import LoginModal from '../features/auth/LoginModal';
import Button from '../components/common/Button';
import ExcelUploadModal from '../components/modal/ExcelUploadModal';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import DecoratedNickname from "../components/common/DecorateNickname";

function Bet() {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const [leagues, setLeagues] = useState([]);
    const [expandedLeague, setExpandedLeague] = useState(null);
    const [betAmount, setBetAmount] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [selectedLeagueId, setSelectedLeagueId] = useState(null);
    const [bets, setBets] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [odds, setOdds] = useState({});
    const [confirmEndBetting, setConfirmEndBetting] = useState(null);
    const [winningTeam, setWinningTeam] = useState(null);


    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserInfo({
                    role: decoded.role,
                    points: decoded.points
                });
                fetchLeagues();

                const socket = new SockJS('http://15.165.163.233:9832/ws');
                const client = Stomp.over(socket);

                client.connect({}, () => {
                    setStompClient(client);
                });

                return () => {
                    if (client.connected) {
                        client.disconnect();
                    }
                };
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserInfo(null);
            }
        } else {
            setUserInfo(null);
        }
    }, []);

    const subscribeToLeague = useCallback((leagueId) => {
        if (stompClient && stompClient.connected) {
            stompClient.subscribe(`/topic/odds/${leagueId}`, (message) => {
                const newOdds = JSON.parse(message.body);
                setOdds(prevOdds => ({...prevOdds, [leagueId]: newOdds}));
            });

            stompClient.subscribe(`/topic/bets/${leagueId}`, (message) => {
                const newBets = JSON.parse(message.body);
                setBets(newBets);
            });
        }
    }, [stompClient]);

    const unsubscribeFromLeague = useCallback((leagueId) => {
        if (stompClient && stompClient.connected) {
            stompClient.unsubscribe(`/topic/odds/${leagueId}`);
            stompClient.unsubscribe(`/topic/bets/${leagueId}`);
        }
    }, [stompClient]);

    useEffect(() => {
        if (expandedLeague) {
            subscribeToLeague(expandedLeague);
        }
        return () => {
            if (expandedLeague) {
                unsubscribeFromLeague(expandedLeague);
            }
        };
    }, [expandedLeague, subscribeToLeague, unsubscribeFromLeague]);


    const fetchLeagues = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('http://15.165.163.233:9832/api/user/betList', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const groupedLeagues = groupLeaguesByMatchCode(response.data);
            console.log(groupedLeagues);
            setLeagues(groupedLeagues);
        } catch (error) {
            console.error('Error fetching leagues:', error);
        }
    };

    const fetchBets = async (leagueId) => {
        try {
            const betResponse = await axios.get(`http://15.165.163.233:9832/public/${leagueId}/bets`);
            console.log("betResponse", betResponse.data);
            setBets(betResponse.data);
        } catch (error) {
            console.error('Error fetching bets:', error);
        }
    };

    const groupLeaguesByMatchCode = (data) => {
        const grouped = data.reduce((acc, item) => {
            const {leagueMatchCode, teamName, leagueName, betDeadLine, teamId, leagueId, leagueSeq, ...rest} = item;
            if (!acc[leagueMatchCode]) {
                acc[leagueMatchCode] = {
                    leagueName,
                    betDeadLine,
                    leagueId,
                    leagueSeq,
                    teams: {}
                };
            }
            if (!acc[leagueMatchCode].teams[teamName]) {
                acc[leagueMatchCode].teams[teamName] = {
                    teamId,  // teamId 추가
                    members: []
                };
            }
            acc[leagueMatchCode].teams[teamName].members.push(rest);
            return acc;
        }, {});

        return Object.keys(grouped).map(matchCode => ({
            leagueMatchCode: matchCode,
            leagueSeq: grouped[matchCode].leagueSeq,
            betDeadLine: grouped[matchCode].betDeadLine,
            leagueName: grouped[matchCode].leagueName,
            leagueId: grouped[matchCode].leagueId,  // leagueId 반환
            teams: Object.entries(grouped[matchCode].teams)
                .sort(([aTeam], [bTeam]) => aTeam.localeCompare(bTeam))
                .map(([teamName, teamData]) => ({
                    teamName,
                    teamId: teamData.teamId,  // teamId 반환
                    members: teamData.members.sort((a, b) => {
                        const positionOrder = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
                        return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
                    })
                }))
        }));
    };

    useEffect(() => {
        if (expandedLeague) {
            fetchBets(expandedLeague);
            fetchOdds(expandedLeague);
        }
    }, [expandedLeague]);

    const handleEndBetting = async (leagueSeq, leagueName, teams) => {
        setConfirmEndBetting({ leagueSeq, leagueName, teams });
    };

    const confirmEndBettingAction = async () => {
        if (!confirmEndBetting || !winningTeam) return;

        try {
            const token = Cookies.get('token');
            await axios.post(`http://15.165.163.233:9832/api/admin/endBetting/${confirmEndBetting.leagueSeq}`,
                { winningTeamId: winningTeam },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            alert(`${confirmEndBetting.leagueName} 베팅이 종료되었습니다. 승리 팀: ${winningTeam}`);
            fetchLeagues();
        } catch (error) {
            console.error('Error ending betting:', error);
            alert('베팅 종료 중 오류가 발생했습니다.');
        } finally {
            setConfirmEndBetting(null);
            setWinningTeam(null);
        }
    };


    const handleLoginSuccess = () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserInfo(decoded);
                fetchLeagues();
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    };

    const handleExcelUpload = async (teamsData) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                'http://15.165.163.233:9832/api/admin/uploadLeague',
                teamsData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Uploaded teams data:', response.data);
            setIsExcelModalOpen(false);
        } catch (error) {
            console.error('Error uploading league data:', error);
            alert(error.response?.data?.message || 'Failed to upload league data');
        }
    };

    const handleLeagueClick = (leagueSeq) => {
        if (expandedLeague) {
            unsubscribeFromLeague(expandedLeague);
        }
        setExpandedLeague(expandedLeague === leagueSeq ? null : leagueSeq);
    };

    const handleBetAmountChange = (e) => {
        setBetAmount(Number(e.target.value));
    };

    const handleTeamSelect = (teamName, teamId, leagueId) => {
        setSelectedTeam(prevSelected => prevSelected === teamName ? null : teamName);
        setSelectedTeamId(prevSelected => prevSelected === teamId ? null : teamId);
        setSelectedLeagueId(prevSelected => prevSelected === leagueId ? null : leagueId);
    };

    const updateUserPoints = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('http://15.165.163.233:9832/api/user/points', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserInfo(prevInfo => ({
                ...prevInfo,
                points: response.data
            }));
        } catch (error) {
            console.error('Error updating user points:', error);
        }
    };

    const fetchOdds = async (leagueId) => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`http://15.165.163.233:9832/api/user/betRate/odds/${leagueId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOdds(prevOdds => ({
                ...prevOdds,
                [leagueId]: response.data
            }));

            console.log(odds);
        } catch (error) {
            console.error('Error fetching odds:', error);
        }
    };

    const handlePlaceBet = async (leagueMatchCode, selectedTeamId, selectedLeagueId) => {
        console.log(leagueMatchCode, selectedTeam, betAmount, selectedTeamId, selectedLeagueId);
        if (!userInfo) {
            setIsLoginModalOpen(true);
            return;
        }

        if (!selectedTeam || betAmount <= 0 || betAmount > userInfo.points) {
            alert('올바른 팀을 선택하고 유효한 베팅 금액을 입력하세요.');
            return;
        }

        const token = Cookies.get('token');
        const id = jwtDecode(token).sub;
        try {
            const response = await axios.post('http://15.165.163.233:9832/api/user/bet', {
                amount: betAmount,
                selectedTeamId,
                selectedLeagueId,
                id: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('베팅이 성공적으로 완료되었습니다!');

            await updateUserPoints();

            await fetchBets(selectedLeagueId);

            setSelectedTeam(null);
            setBetAmount(0);
        } catch (error) {
            console.error('Error placing bet:', error);
            alert('베팅 처리 중 오류가 발생했습니다.');
        }
    };

    if (!userInfo) {
        return (
            <div className="bg-gray-800 space-y-4 p-4 rounded-lg text-white">
                <h1 className="text-2xl font-bold mb-4">내전 베팅</h1>
                <p>베팅을 하려면 로그인이 필요합니다.</p>
                <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    로그인
                </Button>
                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            </div>
        );
    }

    return (
        <div className="bg-gray-800 space-y-4 p-4 rounded-lg text-white">
            <h1 className="text-2xl font-bold mb-4">내전 베팅</h1>
            <div className="flex justify-between items-center mb-4">
                <p>현재 보유 포인트: {userInfo.points}</p>
                {(userInfo.role === 'MASTER' || userInfo.role === 'ADMIN') && (
                    <Button
                        onClick={() => setIsExcelModalOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        엑셀 업로드
                    </Button>
                )}
            </div>

            <ExcelUploadModal
                isOpen={isExcelModalOpen}
                onClose={() => setIsExcelModalOpen(false)}
                onUpload={handleExcelUpload}
            />

            <div className="space-y-4">
                {leagues.map(league => (
                    <div key={league.leagueMatchCode} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center cursor-pointer">
                            <h2 className="text-xl font-semibold">{league.leagueName}</h2>
                            <p>{new Date(league.betDeadLine).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                            {(userInfo.role === 'MASTER' || userInfo.role === 'ADMIN') && (
                                <Button
                                    onClick={() => handleEndBetting(league.leagueSeq, league.leagueName, league.teams)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    배팅 종료
                                </Button>
                            )}
                            <span onClick={() => handleLeagueClick(league.leagueSeq)}>
                                {expandedLeague === league.leagueSeq ? '▲' : '▼'}
                            </span>
                        </div>
                        {expandedLeague === league.leagueSeq && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-4 gap-4">
                                    {league.teams.map(team => (
                                        <div key={team.teamName} className="bg-gray-600 p-4 rounded-lg">
                                            <div
                                                className={`cursor-pointer ${selectedTeam === team.teamName ? 'border-2 border-blue-500' : ''}`}
                                                onClick={() => handleTeamSelect(team.teamName, team.teamId, league.leagueId)}
                                            >
                                                <h3 className="text-lg font-bold mb-2">{team.teamName}</h3>
                                                <ul>
                                                    {team.members.map(member => (
                                                        <li key={member.memberId}>{member.playerName} - {member.position}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="mt-2 p-2 bg-gray-700 rounded">
                                                <p className="text-center font-semibold">
                                                    배당률: {odds[league.leagueSeq] && odds[league.leagueSeq][team.teamId]
                                                    ? odds[league.leagueSeq][team.teamId].odds.toFixed(2)
                                                    : '계산 중...'}
                                                </p>
                                                <p className="text-center">
                                                    걸린
                                                    포인트: {odds[league.leagueSeq] && odds[league.leagueSeq][team.teamId]
                                                    ? odds[league.leagueSeq][team.teamId].points
                                                    : '계산 중...'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <input
                                        type="number"
                                        value={betAmount}
                                        onChange={handleBetAmountChange}
                                        placeholder="베팅 금액"
                                        className="flex-grow p-2 border rounded bg-gray-600 text-white"
                                    />
                                    <Button
                                        onClick={() => handlePlaceBet(league.leagueMatchCode, selectedTeamId, league.leagueId)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        disabled={!selectedTeam}
                                    >
                                        {selectedTeam ? `${selectedTeam}에 베팅하기` : '팀 선택'}
                                    </Button>
                                </div>

                                {/* 베팅 내역 표시 부분 */}
                                <div className="bg-gray-700 p-4 rounded-lg mt-4">
                                    <h2 className="text-xl font-bold mb-4">리그 베팅 내역</h2>
                                    <div className="space-y-4">
                                        {bets.map(bet => (
                                            <div key={bet.id} className="bg-gray-600 p-4 rounded-lg">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold">팀: {bet.teamId}</h3>
                                                        <p>유저: </p>
                                                        <DecoratedNickname
                                                            nickname={bet.userName}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p>베팅 금액: {bet.betAmount}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400">베팅
                                                    시간: {new Date(bet.betTime).toLocaleString('ko-KR')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {confirmEndBetting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">베팅 종료 확인</h3>
                        <p>{confirmEndBetting.leagueName} 베팅을 종료하시겠습니까?</p>
                        <p className="text-sm text-gray-400 mt-2">승리 팀을 선택해주세요:</p>
                        <div className="mt-4">
                            {confirmEndBetting.teams.map(team => (
                                <button
                                    key={team.teamId}
                                    onClick={() => setWinningTeam(team.teamId)}
                                    className={`mr-2 mb-2 px-4 py-2 rounded ${
                                        winningTeam === team.teamId
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                >
                                    {team.teamName}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                onClick={() => {
                                    setConfirmEndBetting(null);
                                    setWinningTeam(null);
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                취소
                            </Button>
                            <Button
                                onClick={confirmEndBettingAction}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                disabled={!winningTeam}
                            >
                                종료
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bet;
