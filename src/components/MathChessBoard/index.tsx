import React, { useEffect, useState } from 'react';
// import Sound from "react-sound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCog, faChevronRight, faRotateLeft, faForwardFast} from '@fortawesome/free-solid-svg-icons';
import { initialBoard } from './initialBoard';
import  { player1Positions } from './player1Positions';
import  { player2Positions } from './player2Positions';
import Modal from '../Modal';
import EndGameModal from "../EndGameModal";
import RuleModal from "../RuleModal";
import SettingsModal from "../SettingsModal";
import "./style.css"
import {useErrorMessage} from "../../hooks/useErrorMessage";


enum Player {
    EMPTY,
    PLAYER1,
    PLAYER2,
    NONE
}

class Piece {
    player: Player;
    value: number;
    x: number;
    y: number;
    clicked: boolean;
    highlight: boolean;

    constructor(player: Player = Player.NONE, value: number, x: number, y: number, clicked = false, highlight = false) {
        this.player = player;
        this.value = value;
        this.x = x;
        this.y = y;
        this.clicked = clicked;
        this.highlight = highlight;
    }
}

enum Mode{
    Practice,
    Contest
}

const boardModel: Piece[][] = [...Array(15)].map(() => Array(15).fill(new Piece(Player.EMPTY, -1, -1, -1)));

const turnHistory: { oldX: number; oldY: number; newX: number; newY: number; }[] = [];
const boardHistory = [];

const MathChessBoard: React.FC = () => {
    const [board, setBoard] = useState<Piece[][]>(boardModel);
    const [turn, setTurn] = useState<Player>(Player.PLAYER1);
    const [hasMoved, setHasMoved] = useState(false);

    const player1: string[] = ["#ff99c2", "#ff6699", "rgba(255,102,153,0.5)"];
    const player2: string[] = [ "#99ccff","#6699cc", "rgba(102,153,204,0.5)"];
    const empty: string = "#FFFFFF";

    const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number}>();
    const [highlightPiece, setHighlightPiece] = useState<{x: number, y: number}[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [numbersPassedBy, setNumbersPassedBy] = useState<number[]>([]);
    const [conseqJumpNumbers, setConseqJumpNumbers] = useState<number[][]>([]);

    const { errorMessage, isVisible, showError, hideError } = useErrorMessage();

    const [player1points, setPlayer1points] = useState([0,0,0,0,0,0,0,0,0,0]);
    const [player2points, setPlayer2points] = useState([0,0,0,0,0,0,0,0,0,0]);

    const SoundEffect = () => {
        const [isPlaying, setIsPlaying] = useState(false);

        const playSound = () => {
            setIsPlaying(true);
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = (shouldSwitch: boolean) => {
        setShowModal(false);
        if (shouldSwitch) {
            switchTurn();
        } else {
            cancelMove();
        }
    }

    const handleShowEndGameModal = () => {
        setShowEndGameModal(true);
    }

    const handleCloseEndGameModal = () => {
        setShowEndGameModal(false);
    }

    const handleShowSettingsModal = () => {
        setShowSettingsModal(true);
    }

    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
    }

    const handleShowRuleModal = () => {
        handleCloseSettingsModal();
        setShowRuleModal(true);
    }

    const handleCloseRuleModal = () => {
        setShowRuleModal(false);
    }

    const initializeBoard = () => {
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                boardModel[row][col] = {...initialBoard[row][col]};
            }
        }
    }

     const findValidMoves = (x: number, y: number) => {
          const validMoves: {x: number, y: number}[] = [];

          for (let i = 1; y - i >= 0; i++) {
              if (boardModel[x][y - i].player === Player.EMPTY &&
                  (boardModel[x][y - i + 2].player === Player.PLAYER1 || boardModel[x][y - i + 2].player === Player.PLAYER2)){
                  validMoves.push({x, y: y - i});
              }
          }

          for (let i = 1; y + i < 15; i++){
              if (boardModel[x][y + i].player === Player.EMPTY &&
                  (boardModel[x][y + i - 2].player === Player.PLAYER1 || boardModel[x][y + i - 2].player === Player.PLAYER2)){
                  validMoves.push({x, y: y + i});
              }
          }


         for (let i = 1; x + i < 15 && y - i >= 0; i++) {
             if (boardModel[x + i][y - i].player === Player.EMPTY &&
                 (boardModel[x + i - 1][y - i + 1].player === Player.PLAYER1 || boardModel[x + i -1][y - i + 1].player === Player.PLAYER2)){
                 validMoves.push({x: x + i, y: y - i});
             }
         }

         for (let i = 1; x + i < 15 && y + i < 15; i++){
             if (boardModel[x + i][y + i].player === Player.EMPTY &&
                 (boardModel[x + i - 1][y + i - 1].player === Player.PLAYER1 || boardModel[x + i -1][y + i - 1].player === Player.PLAYER2)){
                 validMoves.push({x: x + i, y: y + i});
             }
         }

         for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
             if (boardModel[x - i][y - i].player === Player.EMPTY &&
                 (boardModel[x - i + 1][y - i + 1].player === Player.PLAYER1 || boardModel[x - i + 1][y - i + 1].player === Player.PLAYER2)){
                 validMoves.push({x: x - i, y: y - i});
             }
         }

         for (let i = 1; x - i >= 0 && y + i < 15; i++){
             if (x+1 > 15) break;
             if (boardModel[x - i][y + i].player === Player.EMPTY &&
                 (boardModel[x - i + 1][y + i - 1].player === Player.PLAYER1 || boardModel[x - i + 1][y + i - 1].player === Player.PLAYER2)){
                 validMoves.push({x: x - i, y: y + i});
             }
         }

          return validMoves;
     }

     const findValidConseqJumpMoves= (x: number, y: number) => {
         const validMoves: {x: number, y: number}[] = [];
         const pastPositions:{x: number, y: number}[] = [];

         for (let i = 0; i < turnHistory.length; i++){
             pastPositions.push({x: turnHistory[i].oldX, y: turnHistory[i].oldY});
         }

         for (let i = 3; y - i >= 0; i++) {
             if (boardModel[x][y - i].player === Player.EMPTY &&
                 (boardModel[x][y - i + 2].player === Player.PLAYER1 || boardModel[x][y - i + 2].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x && pos.y === y-i)){
                     validMoves.push({x, y: y - i});
                 }
             }
         }

         for (let i = 3; y + i < 15; i++){
             if (boardModel[x][y + i].player === Player.EMPTY &&
                 (boardModel[x][y + i - 2].player === Player.PLAYER1 || boardModel[x][y + i - 2].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x && pos.y === y + i)) {
                     validMoves.push({x, y: y + i});
                 }
             }
         }


         for (let i = 2; x + i < 15 && y - i >= 0; i++) {
             if (boardModel[x + i][y - i].player === Player.EMPTY &&
                 (boardModel[x + i - 1][y - i + 1].player === Player.PLAYER1 || boardModel[x + i - 1][y - i + 1].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x + i && pos.y === y - i)) {
                     validMoves.push({x: x + i, y: y - i});
                 }
             }
         }

         for (let i = 2; x + i < 15 && y + i < 15; i++){
             if (boardModel[x + i][y + i].player === Player.EMPTY &&
                 (boardModel[x + i - 1][y + i - 1].player === Player.PLAYER1 || boardModel[x + i - 1][y + i - 1].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x + i && pos.y === y + i)) {
                     validMoves.push({x: x + i, y: y + i});
                 }
             }
         }

         for (let i = 2; x - i >= 0 && y - i >= 0; i++) {
             if (boardModel[x - i][y - i].player === Player.EMPTY &&
                 (boardModel[x - i + 1][y - i + 1].player === Player.PLAYER1 || boardModel[x - i + 1][y - i + 1].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x - i && pos.y === y - i)) {
                     validMoves.push({x: x - i, y: y - i});
                 }
             }
         }

         for (let i = 2; x - i >= 0 && y + i < 15; i++){
             if (x + 1 > 15) break;
             if (boardModel[x - i][y + i].player === Player.EMPTY &&
                 (boardModel[x - i + 1][y + i - 1].player === Player.PLAYER1 || boardModel[x - i + 1][y + i - 1].player === Player.PLAYER2)){
                 if (!pastPositions.some(pos => pos.x === x - i && pos.y === y + i)) {
                     validMoves.push({x: x - i, y: y + i});
                 }
             }
         }

         return validMoves;
     }

     const nextToEachOther = (x1: number, y1: number, x2: number, y2: number) => {
         if (x1 === x2 && Math.abs(y1 - y2) === 2) return true;
         if (Math.abs(y1 - y2) === 1 && Math.abs (x1 - x2) === 1) return true;
         return false;
    }

    const findNumbersPassedBy = (x1: number, y1: number, x2: number, y2: number) => {
        const numbers : number[] = [];
        if (x1 === x2) {
            const step = y1 < y2 ? 1 : -1;
            for (let y = y1; y !== y2; y += step * 2) {
                if (boardModel[x1][y].player !== Player.EMPTY && boardModel[x1][y].player !== Player.NONE) {
                    numbers.push(boardModel[x1][y].value);

                }
            }
        } else {
            const stepX = x1 < x2 ? 1 : -1;
            const stepY = y1 < y2 ? 1 : -1;
            for (let i = 0; i < Math.abs(x1 - x2); i++) {
                if (boardModel[x1 + i * stepX][y1 + i * stepY].player !== Player.EMPTY ){
                    //&& boardModel[x1 + i * stepX][y1 + i * stepY].player !== Player.NONE) {
                    numbers.push(boardModel[x1 + i * stepX][y1 + i * stepY].value);
                }
            }
        }
        return numbers;
    }

    const movePiece = (oldPiece: { x: number; y: number }, newX: number, newY: number) => {
        const movingPiece = boardModel[oldPiece.x][oldPiece.y];
        boardModel[newX][newY] = new Piece(movingPiece.player, movingPiece.value, newX, newY, true);
        boardModel[oldPiece.x][oldPiece.y] = new Piece(Player.EMPTY, -1, oldPiece.x, oldPiece.y);
        turnHistory.push({oldX: oldPiece.x, oldY: oldPiece.y, newX, newY});
        setSelectedPiece({x: newX, y: newY});
        //setNumbersPassedBy([]);
        if (!nextToEachOther(oldPiece.x, oldPiece.y, newX, newY)) {
            setHighlightPiece(findValidConseqJumpMoves(newX, newY));
            setNumbersPassedBy(findNumbersPassedBy(oldPiece.x, oldPiece.y, newX, newY));
            setConseqJumpNumbers(prevState => [...prevState,findNumbersPassedBy(oldPiece.x, oldPiece.y, newX, newY)]);
            //setConseqJumpCount(prevState => (prevState + 1));
            //console.log(numbersPassedBy);
            //console.log(conseqJumpNumbers);
            //console.log(conseqJump);
        } else {
            setNumbersPassedBy([]);
        }
        // console.log(findValidMoves(newX,newY));
        //playSound();
        setHasMoved(true);
        return true;
    }

    const cancelMove = () => {
        while (turnHistory.length > 0) {
            const move: { oldX: number; oldY: number; newX: number; newY: number; } | undefined = turnHistory.pop();
            if (move === undefined) return;
            const movingPiece = boardModel[move.newX][move.newY];
            boardModel[move.oldX][move.oldY] = new Piece(movingPiece.player, movingPiece.value, move.oldX, move.oldY, false);
            boardModel[move.newX][move.newY] = new Piece(Player.EMPTY, -1, move.newX, move.newY);
        }
        setSelectedPiece(undefined);
        setHasMoved(false);
        //setConseqJumpCount(0);
        setConseqJumpNumbers([]);
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
        setHighlightPiece([]);
        setNumbersPassedBy([]);
        setBoard([...boardModel]);
    }

    const drawPiece = (x: number, y: number, piece: Piece) => {
        const pieceStyles: { [key in Player]: string } = {
            [Player.PLAYER1]: player1[Number(piece.clicked)],
            [Player.PLAYER2]: player2[Number(piece.clicked)],
            [Player.NONE]: 'transparent',
            [Player.EMPTY]: empty,
        };

        const style: React.CSSProperties = {
            position: "absolute",
            top: `${y * 35 + 150}px`,
            left: `${x * 70 + 150}px`,
            width: piece.highlight ? "45px" : "50px",
            height: piece.highlight ? "45px" : "50px",
            lineHeight: "45px",
            borderRadius: "50%",
            border: "solid #000",
            borderWidth: piece.highlight ? "5px" : "0",
            borderColor: turn === Player.PLAYER1 ? player1[2] : player2[2],
            backgroundColor: pieceStyles[piece.player],
            display: piece.player === Player.NONE ? "none" : "block",
            zIndex: piece.player === Player.NONE ? "-1" : "1",
            textAlign: "center",
            verticalAlign: "middle",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",

    };

       const textStyle: React.CSSProperties = {
            display:"inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
            fontSize: "18px",
            fontWeight: "bolder",
    };
        const baseStyle: React.CSSProperties = {
            display:"inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
            fontSize: "18px",
            fontWeight: "bolder",
            color:"lightgrey"
        };

        const handleClick = () => {
            if (piece.player === Player.NONE) {
                return
            }
            if (showEndGameModal) {
                return;
            }
            highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
            if (piece.player === Player.EMPTY) {
                if (selectedPiece && highlightPiece.some(piece => piece.x === x && piece.y === y)){
                    movePiece(selectedPiece, x, y);
                }
                return
            }
            if (hasMoved) {
                return
            }
            
            if (selectedPiece) {
                boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
            }
            if (selectedPiece?.x === x && selectedPiece?.y === y) {
                setSelectedPiece(undefined);
                setHighlightPiece([]);
            } else {
                if (piece.player === turn) {
                    setSelectedPiece({x, y});
                    setHighlightPiece(findValidMoves(x, y));
                }
            }
        };

        let baseNumber = player1Positions.findIndex(pair => pair.x === piece.x && pair.y === piece.y);
        if (baseNumber === -1) {
            baseNumber = player2Positions.findIndex(pair => pair.x === piece.x && pair.y === piece.y);
        }

        return (
            <div style={style} onClick={handleClick}>
                {piece.value >= 0 ?
                    <span style={textStyle}>
                        {piece.value}
                    </span>
                    :
                    baseNumber !== -1 &&
                        <span style={baseStyle}>
                            {baseNumber}
                        </span>
                }
            </div>
        );
    };

    useEffect(() => {
        if (selectedPiece) {
            boardModel[selectedPiece.x][selectedPiece.y].clicked = true;
        }

        setBoard([...boardModel]);

    }, [selectedPiece]);

    useEffect(() => {
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = true);
        setBoard([...boardModel]);
    }, [highlightPiece])

    useEffect(() => {
        initializeBoard();
        setBoard([...boardModel])
    }, [])

    const resetBoard = () => {
        initializeBoard();
        setHighlightPiece([]);
        setSelectedPiece(undefined);
        setHasMoved(false);
        setNumbersPassedBy([]);
        //setConseqJumpCount(0);
        setConseqJumpNumbers([]);
        setBoard([...boardModel]);
        setShowModal(false);
        setShowEndGameModal(false);
        hideError();
        setPlayer1points([0,0,0,0,0,0,0,0,0,0]);
        setPlayer2points([0,0,0,0,0,0,0,0,0,0]);
    }

    const switchTurn = () => {
        if (turnHistory.length === 0 ||
            (turnHistory[0].oldX === turnHistory[turnHistory.length -1].newX && turnHistory[0].oldY === turnHistory[turnHistory.length -1].newY )) {
            showError("Please make a move.");
            return;
        }
        boardHistory.push({oldX: turnHistory[0].oldX, oldY: turnHistory[0].oldY, newX: turnHistory[turnHistory.length - 1].newX, newY: turnHistory[turnHistory.length - 1].newY})

       while (turnHistory.length > 0) {
            turnHistory.pop();
        }

        if (turn === Player.PLAYER1) {
            setTurn(Player.PLAYER2)
        } else {
            setTurn(Player.PLAYER1)
        }
        hideError();
        setHasMoved(false);
        if (selectedPiece) {
            boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
            setSelectedPiece(undefined);
        }
        //setConseqJumpCount(0);
        setConseqJumpNumbers([]);
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
        setBoard([...boardModel]);
    }

    const canEndGame = (player: Player) => {
        const player1positions: {x: number; y: number;}[] = [...player1Positions];
        const player2positions: {x: number; y: number;}[] = [...player2Positions];
        let positions: {x: number; y: number;}[] = [];
        if (player === Player.PLAYER1) {
            positions = player2positions;
        } else {
            positions = player1positions;
        }
        if (positions.some(position => boardModel[position.x][position.y].player !== player)) {
                showError("You cannot end the game now.");
                return;
        }

        setPlayer1points(prevPoints => (
            prevPoints.map((point, i) => (
                    boardModel[player2positions[i].x][player2positions[i].y].value
                )
            )
        ));
        setPlayer2points(prevPoints => (
            prevPoints.map((point, i) => (
                    boardModel[player1positions[i].x][player1positions[i].y].value
                )
            )
        ));
        /*for (let i = 0; i <= 9; i++) {
            player1points[i] = boardModel[player2positions[i].x][player2positions[i].y].value;
            player2points[i] = boardModel[player1positions[i].x][player1positions[i].y].value;
        }*/
        handleShowEndGameModal();
    }

    /*<Sound
                url="/sounds/bouncing_sound.mp3"
                playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                onFinishedPlaying={() => setIsPlaying(false)}
            />

     */
    return (
        <>

        <div className="container">
            <div className="title">
                Math Chess
            </div>
            <div className="setting-button" onClick={handleShowSettingsModal}>
                <button>
                    <FontAwesomeIcon icon={faCog} className="icon" />
                </button>
            </div>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((value, colIndex) => (
                        <div key={colIndex}>
                            {drawPiece(rowIndex, colIndex, value)}
                        </div>
                    ))}
                </div>
            ))}

            <div className={"player1-buttons"}>
                <div className={`player-label1 ${turn === Player.PLAYER1 ? 'highlight1' : ''}`}>
                    <span className="label-text">Player 1</span>
                </div>
                <div>
                    <button title="Next Turn" onClick={turn === Player.PLAYER1? (conseqJumpNumbers.length <= 1 && numbersPassedBy.length <= 1 ? switchTurn : handleShowModal): undefined}>
                       <FontAwesomeIcon icon={faChevronRight} className={"icon"}/>
                    </button>
                    <button title="Reset Current Turn" onClick={turn === Player.PLAYER1 ? cancelMove : undefined}>
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                    <button title="Call End Game" onClick={turn === Player.PLAYER1 ? () => canEndGame(turn): undefined}>
                    <FontAwesomeIcon icon={faForwardFast} />
                </button>
                    <span className={`error-message ${isVisible ? '' : 'fadeout'}`}>
                        {turn===Player.PLAYER1 && errorMessage}
                    </span>
                </div>

            </div>
            <div className={"player2-buttons"}>
                <div className={`player-label2 ${turn === Player.PLAYER2 ? 'highlight2' : ''}`}>
                    <span className="label-text">Player 2</span>
                </div>
                <div>
                     <span className={`error-message ${isVisible ? '' : 'fadeout'}`}>
                        {turn===Player.PLAYER2 && errorMessage}
                    </span>
                    <button title="Next Turn" onClick={turn === Player.PLAYER2 ? (conseqJumpNumbers.length <= 1 && numbersPassedBy.length <= 1 ? switchTurn : handleShowModal) : undefined}>
                        <FontAwesomeIcon icon={faChevronRight} className={"icon"}/>
                    </button>
                    <button title="Reset Current Turn" onClick={turn === Player.PLAYER2 ? cancelMove : undefined}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                     <button title="Call End Game" onClick={turn === Player.PLAYER2 ? () => canEndGame(turn): undefined}>
                    <FontAwesomeIcon icon={faForwardFast} />
                </button>

                </div>

            </div>


        </div>

            {selectedPiece && <Modal isOpen={showModal} onClose={handleCloseModal} conseqJumpNumbers={conseqJumpNumbers} goal={board[selectedPiece?.x][selectedPiece?.y].value} />}
            <EndGameModal isOpen={showEndGameModal} onClose={handleCloseEndGameModal} startNewGame={resetBoard} player1points={player1points} player2points={player2points} />
            <SettingsModal isOpen={showSettingsModal} onClose={handleCloseSettingsModal} restart={resetBoard} handleHelp={handleShowRuleModal}/>
            <RuleModal isOpen={showRuleModal} onClose={handleCloseRuleModal}/>

        </>

    );
};

export default MathChessBoard;