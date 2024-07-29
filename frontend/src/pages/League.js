import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";
import TeamStats from "../components/common/TeamStats";
import TournamentItem from "../components/common/TournamentItem";

const League = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMatchData, setSelectedMatchData] = useState(null);
    const [selectedTournament, setSelectedTournament] = useState(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get('http://15.165.163.233:9832/public/leagueList');
                setTournaments(response.data);
                setLoading(false);
            } catch (err) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleTournamentClick = async (matchCodes, tournament) => {
        if (selectedTournament === tournament) {
            // If the clicked tournament is already selected, clear the selection
            setSelectedTournament(null);
            setSelectedMatchData(null);
        } else {
            try {
                const response = await axios.get('http://15.165.163.233:9832/public/matchCodesList', {
                    params: { matchCodes }
                });
                setSelectedMatchData(response.data);
                setSelectedTournament(tournament);
            } catch (err) {
                setError('경기 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">토너먼트 목록</h1>
            <div className="space-y-4 grid grid-cols-1 gap-4">
                {tournaments.map((tournament, index) => (
                    <div key={index}>
                        <TournamentItem
                            date={tournament.leagueDate}
                            name={tournament.leagueName}
                            participants={tournament.playerCount}
                            matches={tournament.gameCount}
                            hasFinal={tournament.hasFinal}
                            onClick={() => handleTournamentClick(tournament.matchCodes, tournament)}
                        />
                        {selectedTournament === tournament && selectedMatchData && (
                            <div className="mt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(selectedMatchData.teamStats).map(([teamName, teamStats]) => (
                                        <TeamStats
                                            key={teamName}
                                            teamName={teamName}
                                            teamStats={teamStats}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default League;
