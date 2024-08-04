import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
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

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[1]; // 두 번째 시트 선택
            const worksheet = workbook.Sheets[sheetName];

            const newTeams = [];
            const columns = ['C', 'F', 'I', 'L']; // A, B, C, D 팀에 해당하는 열

            columns.forEach((col, index) => {
                if (index < teamCount) {
                    const teamMembers = [];
                    for (let row = 2; row <= 6; row++) {
                        const cellAddress = col + row;
                        const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
                        teamMembers.push(cellValue !== '#N/A' ? cellValue : '');
                    }
                    newTeams.push(teamMembers);
                }
            });

            setTeams(newTeams);
        };

        reader.readAsArrayBuffer(file);
    }, [teamCount]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xlsx, .xls' });

    return (
        <div className="bg-gray-800 space-y-4 max-h-96 overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-4">리그전 팀 설정</h2>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-4 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-300">엑셀 파일을 드래그하거나 클릭하여 업로드하세요</p>
            </div>

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