import React, { useState } from 'react';
import PlayerStats from "../components/common/PlayerStats";
import AutocompleteNicknameInput from "../components/common/AutocompleteNicknameInput";

const PlayerSearch = () => {
    const [nickname, setNickname] = useState('');
    const [searchedNickname, setSearchedNickname] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchedNickname(nickname);
    };

    const handleSelectNext = () => {
        setSearchedNickname(nickname);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">플레이어 검색</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex">
                    <div className="flex-grow">
                        <AutocompleteNicknameInput
                            value={nickname}
                            onChange={setNickname}
                            placeholder="닉네임을 입력하세요"
                            onSelectNext={handleSelectNext}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        검색
                    </button>
                </div>
            </form>
            {searchedNickname && <PlayerStats nickname={searchedNickname} />}
        </div>
    );
};

export default PlayerSearch;