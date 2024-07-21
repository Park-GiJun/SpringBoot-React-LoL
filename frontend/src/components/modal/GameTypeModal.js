import React from 'react';

function GameTypeModal({ onSelect }) {
    return (
        <div>
            <h2 className="bg-gray-800 text-2xl font-bold mb-4">게임 타입 선택</h2>
            <div className="space-y-4">
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => onSelect('simple')}
                >
                    단순 내전
                </button>
                <button
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => onSelect('tournament')}
                >
                    대회
                </button>
            </div>
        </div>
    );
}

export default GameTypeModal;