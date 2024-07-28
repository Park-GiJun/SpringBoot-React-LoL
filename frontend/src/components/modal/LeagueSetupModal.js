import React, { useState } from 'react';
import AutoCompleteNicknameInput from "../common/AutocompleteNicknameInput";

function LeagueSetupModal({ teamCount, onSetup }) {
    const [teams, setTeams] = useState(Array(teamCount).fill().map(() => Array(5).fill('')));

    const handlePlayerChange = (teamIndex, playerIndex, value) => {
        const newTeams = [...teams];
        newTeams[teamIndex][playerIndex] = value;
        setTeams(newTeams);
    };

    const handleSubmit = () => {
        onSetup({ teams: teams });
    };


    const handleSelectNext = (teamIndex, playerIndex) => {
        if (playerIndex < 4) {
            document.querySelector(`input[name="team${teamIndex}player${playerIndex + 1}"]`)?.focus();
        } else if (teamIndex < teamCount - 1) {
            document.querySelector(`input[name="team${teamIndex + 1}player0"]`)?.focus();
        }
    };

    return (
        <div className="bg-gray-800 space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">리그전 팀 설정</h2>
            {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="mb-4">
                    <h3 className="font-bold mb-2">팀 {teamIndex + 1}</h3>
                    {team.map((player, playerIndex) => (
                        <AutoCompleteNicknameInput
                            key={playerIndex}
                            value={player}
                            onChange={(value) => handlePlayerChange(teamIndex, playerIndex, value)}
                            placeholder={`플레이어 ${playerIndex + 1}`}
                            onSelectNext={() => handleSelectNext(teamIndex, playerIndex)}
                            name={`team${teamIndex}player${playerIndex}`}
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