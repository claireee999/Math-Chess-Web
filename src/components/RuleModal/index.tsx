import React, {FC, ReactNode, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import "./style.css"
import { rules } from "./rules"


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RuleModal: FC<ModalProps> = ({ isOpen, onClose}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="RuleModal">
            <div className="ruleModal-content">


            <div className="rule-heading">
                <h2>Rules</h2>
            </div>
            <div className="rule-content">
                <ol>
                    {rules.strings.map((rule: string, index: number) => (
                        <li key={index}>{`${rule}`}</li>
                    ))}
                </ol>
            </div>

            <button onClick={onClose}>
                Back To Game
            </button>
            </div>
        </div>
    )
}

export default RuleModal;

