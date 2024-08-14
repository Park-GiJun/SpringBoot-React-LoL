import React from 'react';

const PlayerStats = ({ playerStats }) => (
    <div className="bg-gray-800 p-1 rounded-lg mt-4 text-center">
        <h4 className="text-xl font-bold text-white mb-4">선수 통계</h4>
        <table className="w-full border border-gray-700 text-center">
            <thead className="bg-gray-700 text-gray-400">
            <tr>
                <th className="p-2 text-xs truncate">선수</th>
                <th className="p-2 text-xs truncate">포지션</th>
                <th className="p-2 text-xs">킬</th>
                <th className="p-2 text-xs truncate">데스</th>
                <th className="p-2 text-xs truncate">어시</th>
                <th className="p-2 text-xs truncate">경기</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(playerStats).map(([playerName, stats]) => (
                <tr key={playerName} className="border-t border-gray-700">
                    <td className="p-2 text-white text-xs truncate">{playerName}</td>
                    <td className="p-2 text-gray-400 text-xs">{stats.position}</td>
                    <td className="p-2 text-gray-400 text-xs">{stats.kills}</td>
                    <td className="p-2 text-gray-400 text-xs">{stats.deaths}</td>
                    <td className="p-2 text-gray-400 text-xs">{stats.assists}</td>
                    <td className="p-2 text-gray-400 text-xs">{stats.gamesPlayed}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const TeamStats = ({ teamName, teamStats }) => (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">{teamName}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">승리</div>
                <div className="text-white">{teamStats.wins / 5}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">패배</div>
                <div className="text-white">{teamStats.losses / 5}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">킬</div>
                <div className="text-white">{teamStats.totalKills}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">데스</div>
                <div className="text-white">{teamStats.totalDeaths}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">어시</div>
                <div className="text-white">{teamStats.totalAssists}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <div className="font-semibold text-white">경기수</div>
                <div className="text-white">{teamStats.gamesPlayed}</div>
            </div>
        </div>
        <PlayerStats playerStats={teamStats.playerStats} />
    </div>
);

export default TeamStats;
