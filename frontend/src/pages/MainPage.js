import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";
import RecentGames from "../components/common/RecentGames";

function MainPage() {
    const [announcement, setAnnouncement] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [betRank, setBetRank] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rankingResponse = await axios.get('http://15.165.163.233:9832/public/ranking');
                const statisticsResponse = await axios.get('http://15.165.163.233:9832/public/statistics');
                const recentGamesResponse = await axios.get('http://15.165.163.233:9832/public/recent-games');
                const announcementResponse = await axios.get('http://15.165.163.233:9832/public/announcement');
                const betRankResponse = await axios.get('http://15.165.163.233:9832/public/betRank');

                setAnnouncement(announcementResponse.data);
                setRankings(rankingResponse.data);
                setStatistics(statisticsResponse.data[0]);
                setRecentGames(recentGamesResponse.data);
                setBetRank(betRankResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortRankings = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        setRankings(rankings.toSorted((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        }));
    };

    const SortableHeader = ({ label, sortKey, className = "" }) => (
        <div
            className={`font-bold cursor-pointer hover:bg-gray-700 p-1 sm:p-2 ${className}`}
            onClick={() => sortRankings(sortKey)}
        >
            {label} {sortConfig.key === sortKey && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </div>
    );

    const getNicknameClass = (nickname) => {
        if (nickname.length > 12) {
            return "text-[8px] sm:text-[10px] truncate";
        } else if (nickname.length > 8) {
            return "text-[9px] sm:text-[11px] truncate";
        }
        return "text-[10px] sm:text-xs truncate";
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2">
            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow max-h-[40vh] flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold mb-2">공지사항</h2>
                <ul className="list-disc pl-5 overflow-y-auto flex-grow">
                    {announcement.map((game, index) => (
                        <li key={index} className="mb-2">
                            <h3 className="text-sm sm:text-lg font-semibold">{game.title}</h3>
                            <div className="text-xs sm:text-sm" dangerouslySetInnerHTML={{__html: game.content}}/>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow max-h-[40vh] flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">승부예측의 신</h2>
                {betRank.length > 0 ? (
                    <div className="overflow-y-auto flex-grow text-center">
                        <div
                            className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 text-xs sm:text-sm sticky top-0 bg-gray-800">
                            <SortableHeader label="이름" sortKey="nickname"/>
                            <SortableHeader label="보유 포인트" sortKey="points"/>
                        </div>
                        {betRank.map((stat, index) => (
                            <div key={index}
                                 className="grid grid-cols-2 gap-1 sm:gap-2 border-t border-gray-700 py-1 sm:py-2 text-xs">
                                <div className={getNicknameClass(stat.nickname)}
                                     title={stat.nickname}>{stat.nickname}</div>
                                <div>{parseInt(stat.point).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">랭킹 데이터가 없습니다.</p>
                )}
            </div>

            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow max-h-[40vh] flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">랭킹</h2>
                {rankings.length > 0 ? (
                    <div className="overflow-y-auto flex-grow text-center">
                        <div
                            className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 mb-2 text-xs sm:text-sm sticky top-0 bg-gray-800">
                            <SortableHeader label="닉네임" sortKey="nickname"/>
                            <SortableHeader label="KDA" sortKey="kda"/>
                            <SortableHeader label="승률" sortKey="winningPercentage"/>
                            <SortableHeader label="챔피언" sortKey="mostChampion"/>
                            <SortableHeader label="포지션" sortKey="mostPosition"/>
                            <SortableHeader label="게임 수" sortKey="playedGames"/>
                        </div>
                        {rankings.map((stat, index) => (
                            <div key={index}
                                 className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 border-t border-gray-700 py-1 sm:py-2 text-xs">
                                <div className={getNicknameClass(stat.nickname)}
                                     title={stat.nickname}>{stat.nickname}</div>
                                <div>{stat.kda.toFixed(2)}</div>
                                <div>{stat.winningPercentage.toFixed(2)}%</div>
                                <div className="truncate" title={stat.mostChampion}>{stat.mostChampion}</div>
                                <div className="">{stat.mostPosition}</div>
                                <div className="">{stat.playedGames}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">랭킹 데이터가 없습니다.</p>
                )}
            </div>

            <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow max-h-[40vh] flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">통계</h2>
                {statistics ? (
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 text-center overflow-y-auto">
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">총 게임 수</h3>
                            <p className="text-lg sm:text-2xl text-blue-400 text-center">{statistics.totalGamesPlayed}</p>
                        </div>
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">총 플레이 일수</h3>
                            <p className="text-lg sm:text-2xl text-green-400 text-center">{statistics.totalDaysPlayed}</p>
                        </div>
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">총 킬 수</h3>
                            <p className="text-lg sm:text-2xl text-red-400 text-center">{statistics.totalKills}</p>
                        </div>
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">최다 킬 챔피언</h3>
                            <p className="text-sm sm:text-xl text-yellow-400 text-center">{statistics.mostKillsChampion}</p>
                        </div>
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">최다 데스 챔피언</h3>
                            <p className="text-sm sm:text-xl text-purple-400 text-center">{statistics.mostDeathsChampion}</p>
                        </div>
                        <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
                            <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">최고 KDA 챔피언</h3>
                            <p className="text-sm sm:text-xl text-pink-400 text-center">{statistics.bestKDAChampion}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">통계 데이터를 불러오는 중 오류가 발생했습니다.</p>
                )}
            </div>
            <RecentGames recentGames={recentGames}/>
        </div>
    );
}

export default MainPage;