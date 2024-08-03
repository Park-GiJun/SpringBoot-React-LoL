import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";

function MultiSearch() {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState('');

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const versionResponse = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
            const latestVersion = versionResponse.data[0];
            setVersion(latestVersion);

            const response = await axios.post('http://localhost:9832/public/multiSearch', null, {
                params: { nickNameList: searchInput }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
        }
        setIsLoading(false);
    };

    const getChampionIconUrl = (championEnglish) => {
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championEnglish}.png`;
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-white">멀티 서치</h1>
                <div className="flex">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="닉네임들을 쉼표로 구분하여 입력하세요"
                        className="flex-grow p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-r-lg transition duration-200"
                    >
                        {isLoading ? '검색 중...' : '검색'}
                    </button>
                </div>
            </div>

            {Object.keys(searchResults).length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">닉네임</th>
                            <th className="p-3 text-left">챔피언</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(searchResults).map(([nickName, stats]) => (
                            <tr key={nickName} className="border-b border-gray-700 hover:bg-gray-750">
                                <td className="p-3 text-white font-semibold">{nickName}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-4">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg">
                                                <img
                                                    src={getChampionIconUrl(stat.championEnglish)}
                                                    alt={stat.champion}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-white">{stat.champion}</p>
                                                    <p className="text-xs text-gray-300">{stat.winRate}% ({stat.totalGames}게임)</p>
                                                    <p className="text-xs text-gray-300">{stat.position}</p>
                                                    <p className="text-xs text-gray-300">KDA: {stat.kda}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MultiSearch;