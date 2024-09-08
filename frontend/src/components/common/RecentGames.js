import React from 'react';
import DecoratedNickname from "./DecorateNickname";

function RecentGames({ recentGames }) {
    return (
        <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow md:col-span-2 lg:col-span-5 max-h-[85vh] overflow-y-auto">
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
                        <div key={matchCode} className="mb-4 sm:mb-6 p-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                <TeamDisplay team={match.blue} isWinner={blueWin} teamColor="blue"/>
                                <TeamDisplay team={match.red} isWinner={!blueWin} teamColor="red"/>
                            </div>
                            <p className="text-center text-sm sm:text-base text-white mt-2 sm:mt-4">
                                {new Date(match.date).toLocaleString()}
                            </p>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-white mt-5">최근 경기 데이터가 없습니다.</p>
            )}
        </div>
    );
}

function TeamDisplay({ team, isWinner, teamColor }) {
    const bgColor = isWinner ? 'bg-blue-400' : 'bg-gray-600';
    const textColor = isWinner ? (teamColor === 'blue' ? 'text-blue-800' : 'text-red-800') : 'text-gray-800';

    return (
        <div className={`p-4 sm:p-6 rounded-lg ${bgColor}`}>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center ${textColor}`}>
                {teamColor === 'blue' ? '블루팀' : '레드팀'}
            </h3>
            {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map(position => {
                const player = team.find(p => p.position === position);
                return player && (
                    <div key={player.id}
                         className="text-sm sm:text-base mb-2 flex justify-between items-center py-2 sm:py-3">
                        <span className="w-1/3 truncate"><DecoratedNickname nickname={player.nickname}/> </span>
                        <span className="w-1/3 truncate text-center">{player.champion}</span>
                        <span className="w-1/3 text-right">{player.kills}/{player.deaths}/{player.assists}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default RecentGames;
