import React, { useState } from 'react';
import axios from 'axios';

const LoLMatchSummary = () => {
    const [blueTeam, setBlueTeam] = useState([]);
    const [redTeam, setRedTeam] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedPlayer, setExpandedPlayer] = useState(null);

    const positions = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    setBlueTeam(assignPositions(data.participants.filter(player => player.TEAM === "100")));
                    setRedTeam(assignPositions(data.participants.filter(player => player.TEAM === "200")));
                    setError(null);
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    setError('파일을 파싱하는 중 오류가 발생했습니다. 올바른 JSON 형식인지 확인해주세요.');
                }
            };
            reader.onerror = () => {
                setError('파일을 읽는 중 오류가 발생했습니다.');
            };
            reader.readAsText(file);
        }
    };

    const assignPositions = (team) => {
        return positions.map((position, index) => ({
            ...team[index],
            ASSIGNED_POSITION: position
        }));
    };

    const movePlayerUp = (team, setTeam, index) => {
        if (index > 0) {
            const newTeam = [...team];
            [newTeam[index - 1], newTeam[index]] = [newTeam[index], newTeam[index - 1]];
            setTeam(newTeam);
        }
    };

    const movePlayerDown = (team, setTeam, index) => {
        if (index < team.length - 1) {
            const newTeam = [...team];
            [newTeam[index + 1], newTeam[index]] = [newTeam[index], newTeam[index + 1]];
            setTeam(newTeam);
        }
    };

    const saveMatchData = async () => {
        try {
            const allPlayers = [...blueTeam, ...redTeam].map(player => ({
                ...player,
                TEAM_POSITION: player.ASSIGNED_POSITION
            }));

            console.log(allPlayers);

            const response = await axios.post('http://localhost:9832/public/testSave', { participants: allPlayers });
            console.log('Data saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
            setError('데이터 저장 중 오류가 발생했습니다.');
        }
    };

    const renderTeamSummary = (team, teamName, setTeam) => (
        <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-blue-300">{teamName} ({team[0].WIN === "Win" ? "승리" : "패배"})</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2 border border-gray-700 text-gray-300">포지션</th>
                        <th className="p-2 border border-gray-700 text-gray-300">챔피언</th>
                        <th className="p-2 border border-gray-700 text-gray-300">플레이어</th>
                        <th className="p-2 border border-gray-700 text-gray-300">K/D/A</th>
                        <th className="p-2 border border-gray-700 text-gray-300">골드</th>
                        <th className="p-2 border border-gray-700 text-gray-300">CS</th>
                        <th className="p-2 border border-gray-700 text-gray-300">데미지</th>
                        <th className="p-2 border border-gray-700 text-gray-300">이동</th>
                    </tr>
                    </thead>
                    <tbody>
                    {team.map((player, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.ASSIGNED_POSITION}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.SKIN}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.NAME}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.CHAMPIONS_KILLED}/{player.NUM_DEATHS}/{player.ASSISTS}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.GOLD_EARNED}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{parseInt(player.MINIONS_KILLED) + parseInt(player.NEUTRAL_MINIONS_KILLED)}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">{player.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS}</td>
                            <td className="p-2 border border-gray-700 text-gray-300">
                                <button onClick={() => movePlayerUp(team, setTeam, index)} disabled={index === 0} className="text-blue-300 hover:text-white transition">위로</button>
                                <button onClick={() => movePlayerDown(team, setTeam, index)} disabled={index === team.length - 1} className="ml-2 text-blue-300 hover:text-white transition">아래로</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPlayerDetails = (player) => (
        <div className="mt-4 p-4 bg-gray-800 rounded shadow">
            <h4 className="font-bold text-lg mb-2 text-blue-300">{player.NAME} ({player.SKIN}) - {player.ASSIGNED_POSITION}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(player).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-300">
                        <span className="font-semibold text-blue-300">{key}:</span> {value}
                    </p>
                ))}
            </div>
        </div>
    );

    const renderPlayers = () => {
        if (!blueTeam.length && !redTeam.length) return null;
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-300">플레이어 상세 정보</h2>
                {[...blueTeam, ...redTeam].map((player, index) => (
                    <div key={index} className="mb-4">
                        <button
                            className="w-full text-left p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                            onClick={() => setExpandedPlayer(expandedPlayer === index ? null : index)}
                        >
                            {player.ASSIGNED_POSITION} - {player.NAME} ({player.SKIN}) - {player.TEAM === "100" ? "블루팀" : "레드팀"}
                        </button>
                        {expandedPlayer === index && renderPlayerDetails(player)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">LoL 매치 요약</h1>
            <input
                type="file"
                onChange={handleFileUpload}
                accept=".json"
                className="mb-6 p-2 border border-gray-700 rounded w-full bg-gray-800 text-gray-300"
            />
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {blueTeam.length > 0 && redTeam.length > 0 && (
                <div>
                    <div className="mb-6 flex justify-center">
                        <button
                            className={`mr-4 px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            팀 개요
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === 'players' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                            onClick={() => setActiveTab('players')}
                        >
                            플레이어 정보
                        </button>
                    </div>
                    {activeTab === 'overview' && (
                        <>
                            {renderTeamSummary(blueTeam, "블루 팀", setBlueTeam)}
                            {renderTeamSummary(redTeam, "레드 팀", setRedTeam)}
                        </>
                    )}
                    {activeTab === 'players' && renderPlayers()}
                    <button
                        onClick={saveMatchData}
                        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                    >
                        매치 데이터 저장
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoLMatchSummary;