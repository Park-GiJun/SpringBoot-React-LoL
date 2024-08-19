import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import * as XLSX from 'xlsx';
import AutocompleteNicknameInput from "../common/AutocompleteNicknameInput";

function LeagueSetupModal({ teamCount, onSetup }) {
    const [teams, setTeams] = useState(Array(teamCount).fill().map(() => Array(5).fill('')));
    const [savedLeagues, setSavedLeagues] = useState([]);
    const [showLeagueList, setShowLeagueList] = useState(false);

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
            const sheetName = workbook.SheetNames[1];
            const worksheet = workbook.Sheets[sheetName];

            const newTeams = [];
            const columns = ['C', 'F', 'I', 'L'];

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

    const fetchLeagueList = async () => {
        try {
            const response = await axios.get('http://15.165.163.233:9832/public/leagues');
            setSavedLeagues(response.data);
            setShowLeagueList(true);
        } catch (error) {
            console.error('Error fetching league list:', error);
            alert('리그 목록을 불러오는데 실패했습니다.');
        }
    };

    const loadSavedLeague = async (leagueId) => {
        try {
            const response = await axios.get(`http://15.165.163.233:9832/public/selectedLeague/${leagueId}`);
            const leagueData = response.data;

            const groupedByTeam = leagueData.reduce((acc, player) => {
                if (!acc[player.teamId]) {
                    acc[player.teamId] = [];
                }
                acc[player.teamId].push(player);
                return acc;
            }, {});

            const newTeams = Object.values(groupedByTeam).map(team =>
                team.sort((a, b) => {
                    const positionOrder = { TOP: 0, JUNGLE: 1, MID: 2, ADC: 3, SUPPORT: 4 };
                    return positionOrder[a.position] - positionOrder[b.position];
                }).map(player => player.playerName)
            );

            setTeams(newTeams);
            setShowLeagueList(false);
        } catch (error) {
            console.error('Error loading saved league:', error);
            alert('리그 데이터를 불러오는데 실패했습니다.');
        }
    };

    return (
        <div className="bg-gray-800 space-y-4 max-h-96 overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-4">리그전 팀 설정</h2>

            <button
                onClick={fetchLeagueList}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                저장된 리그 불러오기
            </button>

            {showLeagueList && (
                <div className="mb-4">
                    <h3 className="font-bold mb-2">저장된 리그 목록</h3>
                    <ul className="bg-gray-700 rounded p-2">
                        {savedLeagues.map(league => (
                            <li
                                key={league.id}
                                className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                                onClick={() => loadSavedLeague(league.id)}
                            >
                                {league.leagueName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-4 ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-300">또는 엑셀 파일 업로드</p>
            </div>

            {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="mb-4">
                    <h3 className="font-bold mb-2">팀 {teamIndex + 1}</h3>
                    {team.map((player, playerIndex) => (
                        <AutocompleteNicknameInput
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