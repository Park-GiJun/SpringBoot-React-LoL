import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

function TestPage() {
    const [parsedData, setParsedData] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[1];
            const worksheet = workbook.Sheets[sheetName];

            const teams = {};
            const columns = ['C', 'F', 'I', 'L'];

            columns.forEach((col, index) => {
                const teamName = String.fromCharCode(65 + index) + '팀';
                teams[teamName] = [];

                for (let row = 2; row <= 6; row++) {
                    const cellAddress = col + row;
                    const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : null;
                    if (cellValue && cellValue !== '#N/A') {
                        teams[teamName].push(cellValue);
                    }
                }

                if (teams[teamName].length === 0) {
                    delete teams[teamName];
                }
            });

            setParsedData(teams);
        };

        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">엑셀 파일 파서</h1>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    엑셀 파일을 여기에 드래그 앤 드롭하거나 클릭하여 선택하세요.
                </p>
            </div>
            {parsedData && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">파싱 결과:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(parsedData).map(([team, members]) => (
                            <div key={team} className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-blue-600">{team}</h3>
                                <ul className="list-disc list-inside">
                                    {members.map((member, index) => (
                                        <li key={index} className="text-gray-700">{member}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestPage;