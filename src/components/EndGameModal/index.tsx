import React, {FC, ReactNode, useEffect, useState} from 'react';
import "./style.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    startNewGame: () => void;
    player1points: number[];
    player2points: number[];

}

const EndGameModal: FC<ModalProps> = ({ isOpen, onClose, startNewGame, player1points, player2points}) => {
    console.log(player1points);
    const [showCalculation, setShowCalculation] = useState(false);
    let winner = 0;
    let player1TotalPoints: number = 0;
    let player2TotalPoints: number = 0;
    let player1pointsCalc: string = "Player1 Points: ";
    let player2pointsCalc: string = "Player2 Points: ";


    for (let i = 0; i <= 9 ; i++){
        player1TotalPoints += i * player1points[i];
        player2TotalPoints += i * player2points[i];
        if (player1TotalPoints > player2TotalPoints) winner = 1;
        else if (player1TotalPoints < player2TotalPoints) winner = 2;
        else winner = 3;

        player1pointsCalc += i + " \u00d7 " + player1points[i];
        player2pointsCalc += i + " \u00d7 " + player2points[i];
        if (i === 9){
            player1pointsCalc += " = " + player1TotalPoints;
            player2pointsCalc += " = " + player2TotalPoints;
        } else{
            player1pointsCalc += " + ";
            player2pointsCalc += " + ";
        }
    }


    if (!isOpen) {
        return null;
    }



    const handleShowCalculation = () => {
        setShowCalculation(!showCalculation);
    }


    return (
        <div className="endGameModal">
            <div className="endGameModalContent">
            <span className="close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <div className="endGameTitle">
                <h2> {winner === 3 ? "Draw" : `Player ${winner} Won` }</h2>
                {showCalculation ? <p>{player1pointsCalc}<br />{player2pointsCalc}</p> : <h2>{player1TotalPoints} vs {player2TotalPoints} </h2>}

            </div>

            </div>
            <div className="endModalButtons">
            <div>
                <button  onClick={handleShowCalculation}>
                    {showCalculation ? "Hide Detailed Points Calculation" : "Show Detailed Points Calculation"}
                </button>
            </div>
            <div>
                <button onClick={startNewGame}>
                New Game
            </button>
            </div>
            </div>


        </div>
    )
}


    export default EndGameModal;
