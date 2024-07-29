import React from 'react';

const TournamentItem = ({ date, name, participants, matches, hasFinal, onClick }) => (
    <div
        className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:bg-gray-700 transition duration-300 cursor-pointer"
        onClick={onClick}
    >
        <div className="grid grid-cols-5 gap-4">
            <div className="text-gray-400">일시</div>
            <div className="text-gray-400">토너먼트명</div>
            <div className="text-gray-400">참여자</div>
            <div className="text-gray-400">경기수</div>
            <div className="text-gray-400">결승전</div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-2">
            <div className="text-white font-semibold">{date}</div>
            <div className="text-white font-semibold">{name}</div>
            <div className="text-white font-semibold">{participants}명</div>
            <div className="text-white font-semibold">{matches}경기</div>
            <div className="text-white font-semibold">{hasFinal === 'Yes' ? '있음' : '없음'}</div>
        </div>
    </div>
);

export default TournamentItem;
