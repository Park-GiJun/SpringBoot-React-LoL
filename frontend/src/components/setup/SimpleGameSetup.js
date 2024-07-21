import React, {useState} from 'react';
import AutocompleteChampionInput from "../common/AutocompleteChampionInput";
import axios from "axios";

function SimpleGameSetup({ gameSettings }) {
    const { rounds, teamA, teamB } = gameSettings;
    const [games, setGames] = useState(Array(rounds).fill().map((_, index) => ({
        blueTeam: index % 2 === 0 ? teamA : teamB,
        redTeam: index % 2 === 0 ? teamB : teamA,
        blueTeamData: Array(5).fill().map(() => ({ nickname: '', champion: '', kills: 0, deaths: 0, assists: 0 })),
        redTeamData: Array(5).fill().map(() => ({ nickname: '', champion: '', kills: 0, deaths: 0, assists: 0 })),
        blueBans: Array(5).fill(''),
        redBans: Array(5).fill(''),
    })));
    const [winners, setWinners] = useState(Array(rounds).fill(null));

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
                date: new Date().toISOString(),
            }));

            const redTeamData = game.redTeamData.map((player, index) => ({
                ...player,
                teamColor: 'red',
                position: getPosition(index),
                winning: redTeamWin,
                date: new Date().toISOString(),
            }));

            const blueBans = game.blueBans.map(champion => ({
                champion,
                teamColor: 'blue',
                date: new Date().toISOString(),
            }));

            const redBans = game.redBans.map(champion => ({
                champion,
                teamColor: 'red',
                date: new Date().toISOString(),
            }));

            return {
                gameData: [...blueTeamData, ...redTeamData],
                banData: [...blueBans, ...redBans]
            };
        });
    };

    const getPosition = (index) => {
        const positions = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
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

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            {games.map((game, gameIndex) => (
                <div key={gameIndex} className="mb-8">
                    {/* ... */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {['blue', 'red'].map((color) => (
                            <div key={color} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-white font-bold mb-2">{color === 'blue' ? '블루팀' : '레드팀'} 밴</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {game[`${color}Bans`].map((ban, banIndex) => (
                                        <AutocompleteChampionInput
                                            key={banIndex}
                                            value={ban}
                                            onChange={(value) => handleBanChange(gameIndex, `${color}Team`, banIndex, value)}
                                            placeholder={`밴 ${banIndex + 1}`}
                                            onSelectNext={() => {
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['blueTeam', 'redTeam'].map((team) => (
                            <div key={team} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-white font-bold mb-2">{team === 'blueTeam' ? '블루팀' : '레드팀'}</h3>
                                {game[`${team}Data`].map((player, playerIndex) => (
                                    <div key={playerIndex} className="grid grid-cols-5 gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="bg-gray-600 text-white p-1 rounded"
                                            value={player.nickname}
                                            onChange={(e) => handleInputChange(gameIndex, team, playerIndex, 'nickname', e.target.value)}
                                            placeholder="닉네임"
                                        />
                                        <AutocompleteChampionInput
                                            value={player.champion}
                                            onChange={(value) => handleInputChange(gameIndex, team, playerIndex, 'champion', value)}
                                            placeholder="챔피언"
                                            onSelectNext={() => {
                                            }}
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
                </div>
            ))}
            <div className="flex justify-between mt-4">
                <div>
                    <h3 className="text-white font-bold mb-2">블루팀 승리</h3>
                    {Array(rounds).fill().map((_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded mr-2 mb-2 ${winners[index] === 'blue' ? 'bg-blue-600' : 'bg-blue-400'}`}
                            onClick={() => handleWinnerSelect(index, 'blue')}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <h3 className="text-white font-bold mb-2">레드팀 승리</h3>
                    {Array(rounds).fill().map((_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded mr-2 mb-2 ${winners[index] === 'red' ? 'bg-red-600' : 'bg-red-400'}`}
                            onClick={() => handleWinnerSelect(index, 'red')}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <button
                className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700"
                onClick={handleSave}
            >
                저장
            </button>
        </div>
    );
}

export default SimpleGameSetup;