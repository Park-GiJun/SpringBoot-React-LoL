import React, { useState } from 'react';
import Modal from "../components/common/Modal";
import GameTypeModal from '../components/modal/GameTypeModal';
import SimpleGameModal from '../components/modal/SimpleGameModal';
import TournamentTypeModal from '../components/modal/TournamentTypeModal';
import LeagueSetupModal from "../components/modal/LeagueSetupModal";
import TournamentSetupModal from "../components/modal/TournamentSetupModal";
import SimpleGameSetup from "../components/setup/SimpleGameSetup";
import LeagueSetup from "../components/setup/LeagueGameSetup";
import TournamentSetup from "../components/setup/TournamentGameSetup";

function SaveGame() {
    const [modalStep, setModalStep] = useState(0);
    const [gameType, setGameType] = useState(null);
    const [tournamentType, setTournamentType] = useState(null);
    const [gameSettings, setGameSettings] = useState(null);

    const handleGameTypeSelect = (type) => {
        setGameType(type);
        setModalStep(type === 'simple' ? 2 : 3);
    };

    const handleTournamentTypeSelect = (type, settings) => {
        setTournamentType(type);
        setModalStep(4);
        setGameSettings(settings);
    };

    const handleSimpleGameSetup = (settings) => {
        setGameSettings(settings);
        setModalStep(0);
    };

    const handleTournamentSetup = (settings) => {
        setGameSettings({ ...gameSettings, ...settings });
        setModalStep(0);
    };

    const renderGameSetup = () => {
        if (!gameSettings) return null;

        switch (gameType) {
            case 'simple':
                return <SimpleGameSetup gameSettings={gameSettings} />;
            case 'tournament':
                if (tournamentType === 'league') {
                    return <LeagueSetup teams={gameSettings.teams} />;
                } else {
                    return <TournamentSetup teams={gameSettings.teams} bracket={gameSettings.bracket} />;
                }
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 p-4 rounded-2xl">
            <h1 className="text-2xl font-bold mb-4 text-white">게임 저장</h1>

            <button
                onClick={() => setModalStep(1)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                새 게임 설정
            </button>

            <Modal isOpen={modalStep > 0} onClose={() => setModalStep(0)}>
                {modalStep === 1 && <GameTypeModal onSelect={handleGameTypeSelect} />}
                {modalStep === 2 && <SimpleGameModal onSetup={handleSimpleGameSetup} />}
                {modalStep === 3 && <TournamentTypeModal onSelect={handleTournamentTypeSelect} />}
                {modalStep === 4 && tournamentType === 'league' && (
                    <LeagueSetupModal
                        teamCount={gameSettings.teamCount}
                        onSetup={handleTournamentSetup}
                    />
                )}
                {modalStep === 4 && tournamentType === 'tournament' && (
                    <TournamentSetupModal
                        teamCount={gameSettings.teamCount}
                        onSetup={handleTournamentSetup}
                    />
                )}
            </Modal>

            {gameSettings && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2 text-white">현재 게임 설정</h2>
                    {renderGameSetup()}
                </div>
            )}
        </div>
    );
}

export default SaveGame;