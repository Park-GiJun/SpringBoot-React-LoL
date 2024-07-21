import React, { useState } from 'react';

function LeagueSetupModal({ teamCount, onSetup }) {
    const [teams, setTeams] = useState(Array(teamCount).fill().map(() => Array(5).fill('')));

    const handlePlayerChange = (teamIndex, playerIndex, value) => {
        const newTeams = [...teams];
        newTeams[teamIndex][playerIndex] = value;
        setTeams(newTeams);
    };

    const handleSubmit = () => {
        onSetup(teams);
    };

    return (
        <div className="bg-gray-800 space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">리그전 팀 설정</h2>
            {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="mb-4">
                    <h3 className="font-bold mb-2">팀 {teamIndex + 1}</h3>
                    {team.map((player, playerIndex) => (
                        <input
                            key={playerIndex}
                            type="text"
                            value={player}
                            onChange={(e) => handlePlayerChange(teamIndex, playerIndex, e.target.value)}
                            placeholder={`플레이어 ${playerIndex + 1}`}
                            className="w-full p-2 border rounded mb-2"
                        />
                    ))}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                설정 완료
            </button>
        </div>
    );
}

export default LeagueSetupModal;