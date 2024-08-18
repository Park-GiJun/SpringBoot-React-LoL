import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import AutocompleteNicknameInput from "../common/AutocompleteNicknameInput";

function SimpleGameModal({ onSetup }) {
    const [rounds, setRounds] = useState(1);
    const [teamA, setTeamA] = useState(Array(5).fill(''));
    const [teamB, setTeamB] = useState(Array(5).fill(''));
    const [focusIndex, setFocusIndex] = useState({ team: 'A', index: 0 });

    const handleTeamChange = (team, index, value) => {
        const newTeam = [...(team === 'A' ? teamA : teamB)];
        newTeam[index] = value;
        team === 'A' ? setTeamA(newTeam) : setTeamB(newTeam);
    };

    const handleSelectNext = () => {
        if (focusIndex.team === 'A' && focusIndex.index < 4) {
            setFocusIndex({ team: 'A', index: focusIndex.index + 1 });
        } else if (focusIndex.team === 'A' && focusIndex.index === 4) {
            setFocusIndex({ team: 'B', index: 0 });
        } else if (focusIndex.team === 'B' && focusIndex.index < 4) {
            setFocusIndex({ team: 'B', index: focusIndex.index + 1 });
        }
    };

    const handleSubmit = () => {
        onSetup({ rounds, teamA, teamB });
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[1]; // 두 번째 시트 선택
            const worksheet = workbook.Sheets[sheetName];

            const newTeamA = [];
            const newTeamB = [];

            // A팀 닉네임 추출 (C열)
            for (let row = 2; row <= 6; row++) {
                const cellAddress = 'C' + row;
                const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
                newTeamA.push(cellValue !== '#N/A' ? cellValue : '');
            }

            // B팀 닉네임 추출 (F열)
            for (let row = 2; row <= 6; row++) {
                const cellAddress = 'F' + row;
                const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
                newTeamB.push(cellValue !== '#N/A' ? cellValue : '');
            }

            setTeamA(newTeamA);
            setTeamB(newTeamB);
        };

        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xlsx, .xls' });

    return (
        <div className="bg-gray-800 space-y-4 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">단순 내전 설정</h2>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-4 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-300">엑셀 파일</p>
            </div>

            <div>
                <label className="block mb-2 text-white">판 수</label>
                <input
                    type="number"
                    value={rounds}
                    onChange={(e) => setRounds(Number(e.target.value))}
                    className="w-full p-2 border rounded text-black"
                    min="1"
                />
            </div>
            {['A', 'B'].map((team) => (
                <div key={team}>
                    <h3 className="font-bold mb-2 text-white">팀 {team}</h3>
                    {Array(5).fill().map((_, i) => (
                        <div key={i} className="mb-2">
                            <AutocompleteNicknameInput
                                value={team === 'A' ? teamA[i] : teamB[i]}
                                onChange={(value) => handleTeamChange(team, i, value)}
                                placeholder={`플레이어 ${i + 1}`}
                                onSelectNext={handleSelectNext}
                            />
                        </div>
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

export default SimpleGameModal;