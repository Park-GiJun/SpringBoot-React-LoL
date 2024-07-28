import React from 'react';

function TournamentSetup({ teams, bracket }) {
    if (!teams || teams.length === 0 || !bracket) {
        return <div>설정된 토너먼트 정보가 없습니다.</div>;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">토너먼트 설정 정보</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">팀 구성</h3>
                {teams.map((team, teamIndex) => (
                    <div key={teamIndex} className="mb-4">
                        <h4 className="text-lg font-medium mb-1">팀 {teamIndex + 1}</h4>
                        <ul className="list-disc list-inside">
                            {team.map((player, playerIndex) => (
                                <li key={playerIndex} className="mb-1">
                                    플레이어 {playerIndex + 1}: {player || '(이름 없음)'}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">대진표</h3>
                {bracket.map((match, matchIndex) => (
                    <div key={matchIndex} className="mb-2">
                        경기 {matchIndex + 1}: 팀 {match[0] + 1} vs 팀 {match[1] + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TournamentSetup;