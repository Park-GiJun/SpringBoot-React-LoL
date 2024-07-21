import React, { useState } from 'react';

function TournamentTypeModal({ onSelect }) {
    const [type, setType] = useState('league');
    const [teamCount, setTeamCount] = useState(4);
    const [hasFinals, setHasFinals] = useState(false);

    const handleSubmit = () => {
        onSelect(type, { teamCount, hasFinals });
    };

    return (
        <div className="bg-gray-800 space-y-4">
            <h2 className="text-2xl font-bold mb-4">대회 타입 선택</h2>
            <div>
                <label className="block mb-2">대회 형식</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border rounded text-black"
                >
                    <option value="league">리그전</option>
                    <option value="tournament">토너먼트</option>
                </select>
            </div>
            <div>
                <label className="block mb-2 ">팀 수</label>
                <input
                    type="number"
                    value={teamCount}
                    onChange={(e) => setTeamCount(Number(e.target.value))}
                    className="w-full p-2 border rounded text-black"
                    min="2"
                />
            </div>
            {type === 'league' && (
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={hasFinals}
                            onChange={(e) => setHasFinals(e.target.checked)}
                            className="mr-2"
                        />
                        결승전 진행
                    </label>
                </div>
            )}
            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                설정 완료
            </button>
        </div>
    );
}

export default TournamentTypeModal;