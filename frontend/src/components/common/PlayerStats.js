import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from "./Loading";
import MatchModal from "./MatchModal";
import MatchDetailModal from "../modal/MatchDetailModal";

const PlayerStats = ({ nickname }) => {
    const [highWinRatePlayers, setHighWinRatePlayers] = useState([]);
    const [positionWinRates, setPositionWinRates] = useState([]);
    const [championStats, setChampionStats] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [highWinRateRes, positionWinRateRes, championStatRes, recentGamesRes] = await Promise.all([
                    axios.get(`http://localhost:9832/public/highWinRatePlayer?nickname=${nickname}`),
                    axios.get(`http://localhost:9832/public/positionWinRate?nickname=${nickname}`),
                    axios.get(`http://localhost:9832/public/championStat?nickname=${nickname}`),
                    axios.get(`http://localhost:9832/public/searchByNickname?nickname=${nickname}`)
                ]);

                setHighWinRatePlayers(highWinRateRes.data);
                setPositionWinRates(positionWinRateRes.data);
                setChampionStats(championStatRes.data);
                setRecentGames(recentGamesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if(nickname){
            fetchData();
        }
    }, [nickname]);

    const handleMatchClick = async (matchCode) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:9832/public/searchByMatchCode?matchCode=${matchCode}`);
            setSelectedMatch(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching match data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if(isLoading){
        return <LoadingSpinner />;
    }

    const StatSection = ({ title, data, headers, renderRow }) => (
        <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow flex flex-col h-full max-h-[280px]">
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">{title}</h2>
            {data.length > 0 ? (
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 text-xs sm:text-sm sticky top-0 bg-gray-800">
                        {headers.map((header, index) => (
                            <div key={index} className="font-semibold">{header}</div>
                        ))}
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {data.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 gap-1 sm:gap-2 border-t border-gray-700 py-1 sm:py-2 text-xs">
                                {renderRow(item)}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center flex-grow flex items-center justify-center">데이터가 없습니다.</p>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-4 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatSection
                    title="높은 승률 플레이어"
                    data={highWinRatePlayers}
                    headers={["플레이어", "승률", "게임 수"]}
                    renderRow={(player) => (
                        <>
                            <div>{player.player}</div>
                            <div>{player.winRate.toFixed(2)}%</div>
                            <div>{player.played}</div>
                        </>
                    )}
                />
                <StatSection
                    title="포지션별 승률"
                    data={positionWinRates}
                    headers={["포지션", "승률", "게임 수"]}
                    renderRow={(position) => (
                        <>
                            <div>{position.position}</div>
                            <div>{position.winRate}%</div>
                            <div>{position.played}</div>
                        </>
                    )}
                />
                <StatSection
                    title="챔피언 통계"
                    data={championStats}
                    headers={["챔피언", "포지션", "승률"]}
                    renderRow={(champion) => (
                        <>
                            <div className="truncate" title={champion.champion}>{champion.champion}</div>
                            <div>{champion.position}</div>
                            <div>{champion.winRate}</div>
                        </>
                    )}
                />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">최근 게임</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-center">
                            <th className="pb-2 pl-2">챔피언</th>
                            <th className="pb-2">포지션</th>
                            <th className="pb-2">KDA</th>
                            <th className="pb-2 pr-2">날짜</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentGames.map((game, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${game.winning === 1 ? 'bg-blue-600' : 'bg-red-600'}`}
                                onClick={() => handleMatchClick(game.matchCode)}
                            >
                                <td className="py-2 pl-2">{game.champion}</td>
                                <td className="py-2">{game.position}</td>
                                <td className="py-2">{game.kills}/{game.deaths}/{game.assists}</td>
                                <td className="py-2 pr-2">{new Date(game.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && selectedMatch && (
                <MatchModal onClose={() => setIsModalOpen(false)} isOpen>
                    <MatchDetailModal recentGames={selectedMatch}/>
                </MatchModal>
            )}
        </div>
    );
};

export default PlayerStats;