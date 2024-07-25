import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from "../components/common/Loading";

function ChampionTierList() {
    const [champions, setChampions] = useState([]);
    const [orderBy, setOrderBy] = useState('winRate');
    const [order, setOrder] = useState('desc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChampionData();
    }, []);

    const fetchChampionData = async () => {
        try {
            const response = await axios.get('http://15.165.163.233:9832/public/tierList');
            setChampions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching champion data:', error);
            setLoading(false);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedChampions = React.useMemo(() => {
        const tierOrder = { 'Tier 1': 1, 'Tier 2': 2, 'Tier 3': 3, 'Tier 4': 4, 'Tier 5': 5 };

        const comparator = (a, b) => {
            if (tierOrder[a.tier] !== tierOrder[b.tier]) {
                return tierOrder[a.tier] - tierOrder[b.tier];
            }

            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        };

        return [...champions].sort((a, b) => {
            return order === 'desc' ? comparator(a, b) : -comparator(a, b);
        });
    }, [champions, order, orderBy]);

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Tier 1': return 'bg-red-700';
            case 'Tier 2': return 'bg-orange-600';
            case 'Tier 3': return 'bg-yellow-600';
            case 'Tier 4': return 'bg-green-700';
            case 'Tier 5': return 'bg-blue-700';
            default: return 'bg-gray-700';
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow ">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                <tr>
                    {['Champion', 'Tier', 'Win Rate', 'Played', 'KDA', 'Most Played By', 'Players Count', 'Ban Rate'].map((header, index) => (
                        <th
                            key={index}
                            className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleRequestSort(header.toLowerCase().replace(/\s/g, ''))}
                        >
                            <div className="flex items-center justify-center">
                                {header}
                                {orderBy === header.toLowerCase().replace(/\s/g, '') && (
                                    <span className="ml-2">
                                    {order === 'desc' ? '▼' : '▲'}
                                </span>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                {sortedChampions.map((champion) => (
                    <tr key={champion.champion} className="hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.champion}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-white font-medium ${getTierColor(champion.tier)} text-center`}>
                            {champion.tier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.winRate.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.played}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.kda.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.mostPlayedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.playersCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{champion.banRate.toFixed(2)}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ChampionTierList;