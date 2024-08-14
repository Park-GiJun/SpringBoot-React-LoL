import React, { useState, useEffect } from 'react';
import AutocompleteChampionInput from "../common/AutocompleteChampionInput";
import AutocompleteNicknameInput from "../common/AutocompleteNicknameInput";
import axios from "axios";

function getKoreanISOString() {
    const now = new Date();
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const koreanDate = new Date(now.getTime() + koreaTimeDiff);
    return koreanDate.toISOString();
}

function LeagueSetup({ teams }) {
    const [games, setGames] = useState([]);
    const [winners, setWinners] = useState([]);
    const koreanISOString = getKoreanISOString();

    useEffect(() => {
        if (teams && teams.length > 0) {
            const initialGames = [];
            const initialWinners = [];
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    initialGames.push({
                        blueTeam: teams[i],
                        redTeam: teams[j],
                        blueTeamData: teams[i].map(player => ({
                            nickname: player,
                            champion: '',
                            kills: 0,
                            deaths: 0,
                            assists: 0
                        })),
                        redTeamData: teams[j].map(player => ({
                            nickname: player,
                            champion: '',
                            kills: 0,
                            deaths: 0,
                            assists: 0
                        })),
                        blueBans: Array(5).fill(''),
                        redBans: Array(5).fill(''),
                    });
                    initialWinners.push(null);
                }
            }
            setGames(initialGames);
            setWinners(initialWinners);
        }
    }, [teams]);

    const handleInputChange = (gameIndex, team, playerIndex, field, value) => {
        setGames(prevGames => {
            const newGames = [...prevGames];
            newGames[gameIndex][`${team}Data`][playerIndex][field] = value;
            return newGames;
        });
    };

    const handleBanChange = (gameIndex, team, banIndex, value) => {
        setGames(prevGames => {
            const newGames = [...prevGames];
            const banField = team === 'blueTeam' ? 'blueBans' : 'redBans';
            newGames[gameIndex][banField][banIndex] = value;
            return newGames;
        });
    };

    const handleWinnerSelect = (gameIndex, winner) => {
        const newWinners = [...winners];
        newWinners[gameIndex] = winner;
        setWinners(newWinners);
    };

    const transformGameData = () => {
        return games.flatMap((game, gameIndex) => {
            const blueTeamWin = winners[gameIndex] === 'blue' ? 1 : 0;
            const redTeamWin = winners[gameIndex] === 'red' ? 1 : 0;

            const blueTeamData = game.blueTeamData.map((player, index) => ({
                ...player,
                teamColor: 'blue',
                position: getPosition(index),
                winning: blueTeamWin,
                date: koreanISOString,
            }));

            const redTeamData = game.redTeamData.map((player, index) => ({
                ...player,
                teamColor: 'red',
                position: getPosition(index),
                winning: redTeamWin,
                date: koreanISOString,
            }));

            const blueBans = game.blueBans.map(champion => ({
                champion,
                teamColor: 'blue',
                date: koreanISOString,
            }));

            const redBans = game.redBans.map(champion => ({
                champion,
                teamColor: 'red',
                date: koreanISOString,
            }));

            return {
                gameData: [...blueTeamData, ...redTeamData],
                banData: [...blueBans, ...redBans]
            };
        });
    };

    const getPosition = (index) => {
        const positions = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
        return positions[index];
    };

    const handleSave = async () => {
        const gameData = transformGameData();
        console.log('Transformed game data:', gameData);

        try {
            const response = await axios.post('http://15.165.163.233:9832/public/save', gameData);
            console.log('Server response:', response.data);
            alert('게임 데이터가 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Error saving game data:', error);
            alert('게임 데이터 저장 중 오류가 발생했습니다.');
        }
    };

    if (!teams || teams.length === 0) {
        return <div>설정된 팀 정보가 없습니다.</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">리그전 설정 정보</h2>
            {games.map((game, gameIndex) => (
                <div key={gameIndex} className="mb-8 border-b border-gray-700 pb-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">
                        경기 {gameIndex + 1}: {game.blueTeam[2]} vs {game.redTeam[2]}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {['blue', 'red'].map((color) => (
                            <div key={color} className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="text-white font-bold mb-2">{color === 'blue' ? '블루팀' : '레드팀'} 밴</h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {game[`${color}Bans`].map((ban, banIndex) => (
                                        <AutocompleteChampionInput
                                            key={banIndex}
                                            value={ban}
                                            onChange={(value) => handleBanChange(gameIndex, `${color}Team`, banIndex, value)}
                                            placeholder={`밴 ${banIndex + 1}`}
                                            onSelectNext={() => {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['blueTeam', 'redTeam'].map((team) => (
                            <div key={team} className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="text-white font-bold mb-2">{team === 'blueTeam' ? '블루팀' : '레드팀'}</h4>
                                {game[`${team}Data`].map((player, playerIndex) => (
                                    <div key={playerIndex} className="grid grid-cols-5 gap-2 mb-2">
                                        <AutocompleteNicknameInput
                                            value={player.nickname}
                                            onChange={(value) => handleInputChange(gameIndex, team, playerIndex, 'nickname', value)}
                                            placeholder="닉네임"
                                            onSelectNext={() => {}}
                                        />
                                        <AutocompleteChampionInput
                                            value={player.champion}
                                            onChange={(value) => handleInputChange(gameIndex, team, playerIndex, 'champion', value)}
                                            placeholder="챔피언"
                                            onSelectNext={() => {}}
                                        />
                                        <input
                                            type="number"
                                            className="bg-gray-600 text-white p-1 rounded"
                                            value={player.kills}
                                            onChange={(e) => handleInputChange(gameIndex, team, playerIndex, 'kills', parseInt(e.target.value))}
                                            placeholder="킬"
                                        />
                                        <input
                                            type="number"
                                            className="bg-gray-600 text-white p-1 rounded"
                                            value={player.deaths}
                                            onChange={(e) => handleInputChange(gameIndex, team, playerIndex, 'deaths', parseInt(e.target.value))}
                                            placeholder="데스"
                                        />
                                        <input
                                            type="number"
                                            className="bg-gray-600 text-white p-1 rounded"
                                            value={player.assists}
                                            onChange={(e) => handleInputChange(gameIndex, team, playerIndex, 'assists', parseInt(e.target.value))}
                                            placeholder="어시스트"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            className={`px-3 py-1 rounded mr-2 mb-2 ${winners[gameIndex] === 'blue' ? 'bg-blue-600' : 'bg-blue-400'}`}
                            onClick={() => handleWinnerSelect(gameIndex, 'blue')}
                        >
                            블루팀 승리
                        </button>
                        <button
                            className={`px-3 py-1 rounded mr-2 mb-2 ${winners[gameIndex] === 'red' ? 'bg-red-600' : 'bg-red-400'}`}
                            onClick={() => handleWinnerSelect(gameIndex, 'red')}
                        >
                            레드팀 승리
                        </button>
                    </div>
                </div>
            ))}
            <button
                className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
                onClick={handleSave}
            >
                저장
            </button>
        </div>
    );
}

export default LeagueSetup;