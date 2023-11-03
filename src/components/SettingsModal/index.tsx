import React, {FC, ReactNode, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import "./style.css"
import "./style.css"


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    restart: () => void;
    handleHelp: () => void;
}

const SettingsModal: FC<ModalProps> = ({ isOpen, onClose, restart, handleHelp}) => {
    if (!isOpen) {
        return null;
    }

    const handleRestart = () => {
        restart();
        onClose();
    }

    return (
        <div className="SettingsModal">
            <div className="modal-heading">
                <FontAwesomeIcon icon={faCog} className="icon" />
                <h2>Settings</h2>
            </div>
            <button onClick={handleRestart}>
                Restart
            </button>
            <button onClick={onClose}>
                Back To Game
            </button>
            <button onClick={handleHelp}>
                Help
            </button>

        </div>
    )
}

export default SettingsModal;

