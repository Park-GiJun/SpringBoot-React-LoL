import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";

function MainPage() {
    const [announcement, setAnnouncement] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const rankingResponse = await axios.get('http://15.165.163.233:9832/public/ranking');
                const statisticsResponse = await axios.get('http://15.165.163.233:9832/public/statistics');
                const recentGamesResponse = await axios.get('http://15.165.163.233:9832/public/recent-games');
                const announcementResponse = await axios.get('http://15.165.163.233:9832/public/announcement');

                setAnnouncement(announcementResponse.data);
                setRankings(rankingResponse.data);
                setStatistics(statisticsResponse.data[0]);
                setRecentGames(recentGamesResponse.data);
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

    const SortableHeader = ({ label, sortKey }) => (
        <div
            className="font-bold cursor-pointer hover:bg-gray-700 p-2"
            onClick={() => sortRankings(sortKey)}
        >
            {label} {sortConfig.key === sortKey && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </div>
    );

    const getNicknameClass = (nickname) => {
        if (nickname.length > 12) {
            return "text-[10px] truncate";
        } else if (nickname.length > 8) {
            return "text-[11px] truncate";
        }
        return "text-xs truncate";
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-auto">
            <div className="bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">공지사항</h2>
                <ul className="list-disc pl-5">
                    {announcement.map((game, index) => (
                        <li key={index}>
                            <h3 className="text-lg font-semibold">{game.title}</h3>
                            <div dangerouslySetInnerHTML={{__html: game.content}}/>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow overflow-auto scrollbar-hide max-h-[49vh] text-center">
                <h2 className="text-xl font-bold mb-2">랭킹</h2>
                {rankings.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-6 gap-2 mb-2 text-sm">
                            <SortableHeader label="닉네임" sortKey="nickname"/>
                            <SortableHeader label="KDA" sortKey="kda"/>
                            <SortableHeader label="승률" sortKey="winningPercentage"/>
                            <SortableHeader label="챔피언" sortKey="mostChampion"/>
                            <SortableHeader label="포지션" sortKey="mostPosition"/>
                            <SortableHeader label="게임 수" sortKey="playedGames"/>
                        </div>
                        {rankings.map((stat, index) => (
                            <div key={index} className="grid grid-cols-6 gap-2 border-t border-gray-700 py-2 text-xs">
                                <div className={getNicknameClass(stat.nickname)}
                                     title={stat.nickname}>{stat.nickname}</div>
                                <div>{stat.kda.toFixed(2)}</div>
                                <div>{stat.winningPercentage.toFixed(2)}%</div>
                                <div className="truncate" title={stat.mostChampion}>{stat.mostChampion}</div>
                                <div>{stat.mostPosition}</div>
                                <div>{stat.playedGames}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>랭킹 데이터가 없습니다.</p>
                )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-center">통계</h2>
                {statistics ? (
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">총 게임 수</h3>
                            <p className="text-2xl text-blue-400">{statistics.totalGamesPlayed}</p>
                        </div>
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">총 플레이 일수</h3>
                            <p className="text-2xl text-green-400">{statistics.totalDaysPlayed}</p>
                        </div>
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">총 킬 수</h3>
                            <p className="text-2xl text-red-400">{statistics.totalKills}</p>
                        </div>
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">최다 킬 챔피언</h3>
                            <p className="text-xl text-yellow-400">{statistics.mostKillsChampion}</p>
                        </div>
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">최다 데스 챔피언</h3>
                            <p className="text-xl text-purple-400">{statistics.mostDeathsChampion}</p>
                        </div>
                        <div className="bg-gray-700 p-5 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">최고 KDA 챔피언</h3>
                            <p className="text-xl text-pink-400">{statistics.bestKDAChampion}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">통계 데이터를 불러오는 중 오류가 발생했습니다.</p>
                )}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow md:col-span-2 lg:col-span-3">
                <h2 className="text-xl font-bold mb-2 text-center">최근 경기</h2>
                {recentGames.length > 0 ? (
                    Object.entries(recentGames.reduce((acc, game) => {
                        if (!acc[game.matchCode]) {
                            acc[game.matchCode] = {blue: [], red: [], date: game.date};
                        }
                        acc[game.matchCode][game.teamColor].push(game);
                        return acc;
                    }, {})).map(([matchCode, match]) => {
                        const blueWin = match.blue[0].winning === 1;
                        return (
                            <div key={matchCode} className="mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${blueWin ? 'bg-blue-400' : 'bg-gray-600'}`}>
                                        <h3 className={`text-lg font-semibold mb-2 text-center ${blueWin ? 'text-blue-800' : 'text-gray-800'}`}>블루팀</h3>
                                        {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map(position => {
                                            const player = match.blue.find(p => p.position === position);
                                            return player && (
                                                <div key={player.id}
                                                     className="text-sm mb-1 flex justify-between items-center py-2">
                                                    <span className="w-1/3 truncate">{player.nickname}</span>
                                                    <span
                                                        className="w-1/3 truncate text-center">{player.champion}</span>
                                                    <span
                                                        className="w-1/3 text-right">{player.kills}/{player.deaths}/{player.assists}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={`p-4 rounded-lg ${!blueWin ? 'bg-red-400' : 'bg-gray-600'}`}>
                                        <h3 className={`text-lg font-semibold mb-2 text-center ${!blueWin ? 'text-red-800' : 'text-gray-800'}`}>레드팀</h3>
                                        {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map(position => {
                                            const player = match.red.find(p => p.position === position);
                                            return player && (
                                                <div key={player.id}
                                                     className="text-sm mb-1 flex justify-between items-center py-2">
                                                    <span className="w-1/3 truncate">{player.nickname}</span>
                                                    <span
                                                        className="w-1/3 truncate text-center">{player.champion}</span>
                                                    <span
                                                        className="w-1/3 text-right">{player.kills}/{player.deaths}/{player.assists}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="text-center text-sm text-white mt-2">
                                    {new Date(match.date).toLocaleString()}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-white mt-5">최근 경기 데이터가 없습니다.</p>
                )}
            </div>
        </div>
    )
        ;
}

export default MainPage;