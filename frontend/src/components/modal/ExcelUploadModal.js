import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Button from '../common/Button';

function ExcelUploadModal({ isOpen, onClose, onUpload }) {
    const [teams, setTeams] = useState([]);
    const [leagueName, setLeagueName] = useState('');
    const [betDeadline, setBetDeadline] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const teamColumns = ['C', 'F', 'I', 'L'];
            const positions = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
            const newTeams = [];

            teamColumns.forEach((col, teamIndex) => {
                const teamMembers = [];
                for (let row = 2; row <= 6; row++) {
                    const cellAddress = col + row;
                    const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '';
                    if (cellValue && cellValue !== '#N/A') {
                        teamMembers.push({
                            name: cellValue,
                            position: positions[row - 2]
                        });
                    }
                }
                if (teamMembers.length > 0) {
                    newTeams.push({
                        id: String.fromCharCode(65 + teamIndex),
                        name: `Team ${String.fromCharCode(65 + teamIndex)}`,
                        members: teamMembers
                    });
                }
            });

            setTeams(newTeams);
        };

        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.xlsx, .xls' });

    const handleSave = () => {
        if (!leagueName || !betDeadline || teams.length === 0) {
            alert('리그 이름, 베팅 마감 시간, 그리고 팀 정보를 모두 입력해주세요.');
            return;
        }
        const numberOfTeams = teams.length
        onUpload({ leagueName, betDeadline, teams, numberOfTeams });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-h-3/4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-white">엑셀 업로드</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        value={leagueName}
                        onChange={(e) => setLeagueName(e.target.value)}
                        placeholder="리그 이름"
                        className="w-full p-2 border rounded bg-gray-700 text-white mb-2"
                    />
                    <input
                        type="datetime-local"
                        value={betDeadline}
                        onChange={(e) => setBetDeadline(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white"
                    />
                </div>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-4 ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <input {...getInputProps()} />
                    <p className="text-gray-300">엑셀 파일을 드래그하여 놓거나 클릭하여 업로드하세요</p>
                </div>

                {teams.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-4 text-white">업로드된 팀 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {teams.map(team => (
                                <div key={team.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                                    <h4 className="text-lg font-bold text-blue-300 mb-3">{team.name}</h4>
                                    <ul className="space-y-2">
                                        {team.members.map((member, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                <span className="text-white">{member.name}</span>
                                                <span className="text-gray-400 text-sm">{member.position}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ExcelUploadModal;