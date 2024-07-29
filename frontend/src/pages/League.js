import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";

const TournamentItem = ({ date, name, participants, matches, hasFinal }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:bg-gray-700 transition duration-300">
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

const League = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get('http://localhost:9832/public/leagueList');
                setTournaments(response.data);
                setLoading(false);
            } catch (err) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">토너먼트 목록</h1>
            <div className="space-y-4">
                {tournaments.map((tournament, index) => (
                    <TournamentItem
                        key={index}
                        date={tournament.leagueDate}
                        name={tournament.leagueName}
                        participants={tournament.playerCount}
                        matches={tournament.gameCount}
                        hasFinal={tournament.hasFinal}
                    />
                ))}
            </div>
        </div>
    );
};

export default League;