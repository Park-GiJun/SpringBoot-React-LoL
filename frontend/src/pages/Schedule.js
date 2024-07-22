import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../index.css';
import RecentGames from "../components/common/RecentGames";

function App() {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [recentGames, setRecentGames] = useState([]);

    useEffect(() => {
        axios.get('http://15.165.163.233:9832/public/matchDate')
            .then(response => {
                const fetchedDates = response.data;
                setDates(fetchedDates);

                if (fetchedDates.length > 0) {
                    const latestDate = new Date(fetchedDates[0].matchDate);
                    setSelectedDate(latestDate);
                    fetchGamesForDate(latestDate);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the dates!', error);
            });
    }, []);

    const fetchGamesForDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        axios.get(`http://15.165.163.233:9832/public/matchData?date=${formattedDate}`)
            .then(response => {
                setRecentGames(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the games!', error);
            });
    };

    const toggleCalendar = () => {
        setIsOpen(!isOpen);
    };

    const handleDateChange = (date) => {
        console.log('Clicked date:', date);
        setSelectedDate(date);
        fetchGamesForDate(date);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            if (dates.find(d => d.matchDate === formattedDate)) {
                return <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1" />;
            }
        }
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            return !dates.find(d => d.matchDate === formattedDate);
        }
        return false;
    };

    return (
        <div className="bg-gray-900 flex flex-col items-start">
            <button onClick={toggleCalendar} className="m-4 p-2 bg-blue-500 text-white rounded">
                {isOpen ? 'Close Calendar' : 'Open Calendar'}
            </button>
            {isOpen && (
                <div className="absolute top-24 bg-white shadow-lg rounded-lg p-2">
                    <Calendar
                        tileContent={tileContent}
                        tileDisabled={tileDisabled}
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="p-2 text-gray-800"
                        tileClassName={({date, view}) => {
                            if (view === 'month') {
                                const formattedDate = date.toISOString().split('T')[0];
                                if (dates.find(d => d.matchDate === formattedDate)) {
                                    return 'bg-blue-400';
                                }
                            }
                            return null;
                        }}
                    />
                </div>
            )}
            <div className="w-full max-w-6xl mx-auto mt-6 p-2">
                <RecentGames recentGames={recentGames}/>
            </div>
        </div>
    );
}

export default App;