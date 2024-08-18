import React from 'react';

function MatchDetailModal({ recentGames }) {
    return (
        <div className="space-y-4">
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
                        <div key={matchCode} className="bg-gray-700 rounded-lg p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TeamDisplay team={match.blue} isWinner={blueWin} teamColor="blue"/>
                                <TeamDisplay team={match.red} isWinner={!blueWin} teamColor="red"/>
                            </div>
                            <p className="text-center text-sm text-gray-400 mt-2">
                                {new Date(match.date).toLocaleString()}
                            </p>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-white">최근 경기 데이터가 없습니다.</p>
            )}
        </div>
    );
}

function TeamDisplay({ team, isWinner, teamColor }) {
    const bgColor = isWinner ? (teamColor === 'blue' ? 'bg-blue-600' : 'bg-red-600') : 'bg-gray-600';
    const textColor = 'text-white';

    return (
        <div className={`p-4 rounded-lg ${bgColor}`}>
            <h3 className={`text-lg font-semibold mb-2 text-center ${textColor}`}>
                {teamColor === 'blue' ? '블루팀' : '레드팀'}
            </h3>
            {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map(position => {
                const player = team.find(p => p.position === position);
                return player && (
                    <div key={player.id}
                         className="text-sm mb-1 flex justify-between items-center py-1">
                        <span className="w-1/4 truncate">{player.nickname}</span>
                        <span className="w-1/4 truncate text-center">{player.champion}</span>
                        <span className="w-1/4 text-center">{player.kills}/{player.deaths}/{player.assists}</span>
                        <span className="w-1/4 text-right">{player.position}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default MatchDetailModal;
