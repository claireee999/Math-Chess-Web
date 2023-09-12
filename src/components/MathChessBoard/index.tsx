import React, { useEffect, useState } from 'react';
import {Button, useBoolean} from "@chakra-ui/react";
import { initialBoard } from './initialBoard';
import Modal from '../Modal';

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

    const player1: string[] = ["#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number}>();
    const [highlightPiece, setHighlightPiece] = useState<{x: number, y: number}[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [numbersPassedBy, setNumbersPassedBy] = useState<number[]>([]);
    //const numbersPassedBy : number[] = [];
    const [conseqJumpCount, setConseqJumpCount] = useState(0);
    const [conseqJumpNumbers, setConseqJumpNumbers] = useState<number[][]>([]);

    const [errorMessage, setErrorMessage] = useState<boolean>(false);

    //const conseqJumpNumbers : number[][] = [];
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = (shouldSwitch: boolean) => {
        setShowModal(false);
        if (shouldSwitch) {
            switchTurn();
        } else {
            cancelMove();
        }
    };


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
            setConseqJumpCount(prevState => (prevState + 1));
            //console.log(numbersPassedBy);
            //console.log(conseqJumpNumbers);
            //console.log(conseqJump);
        } else {
            setNumbersPassedBy([]);
        }
        // console.log(findValidMoves(newX,newY));
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
        setConseqJumpCount(0);
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
            [Player.EMPTY]: empty
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
            borderColor: "rgba(23,248,177,0.73)",
            backgroundColor: pieceStyles[piece.player],
            zIndex: piece.player === Player.NONE ? "-1" : "1",
            textAlign: "center",
            verticalAlign: "middle",
        };

       const textStyle: React.CSSProperties = {
            display:"inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
        };

        const handleClick = () => {
            if (piece.player === Player.NONE) {
                return
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

        return (
            <div style={style} onClick={handleClick}>
                {piece.value >= 0 && <span style={textStyle}>
                    {piece.value}</span>}
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
        setConseqJumpCount(0);
        setConseqJumpNumbers([]);
        setBoard([...boardModel]);

    }

    const switchTurn = () => {
        if (turnHistory.length === 0 ||
            (turnHistory[0].oldX === turnHistory[turnHistory.length -1].newX && turnHistory[0].oldY === turnHistory[turnHistory.length -1].newY )) {
            setErrorMessage(true);
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
        setHasMoved(false);
        if (selectedPiece) {
            boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
            setSelectedPiece(undefined);
        }
        setConseqJumpCount(0);
        setConseqJumpNumbers([]);
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
        setBoard([...boardModel]);
    }


    return (
        <div>
        <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: background }}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((value, colIndex) => (
                        <div key={colIndex}>
                            {drawPiece(rowIndex, colIndex, value)}
                        </div>
                    ))}
                </div>
            ))}
            <Button onClick={resetBoard}>
                Restart
            </Button>
            <Button onClick={conseqJumpCount <= 1 && numbersPassedBy.length <= 1 ? switchTurn : handleShowModal}>
                Next
            </Button>
            <Button onClick={cancelMove}>
                Reset
            </Button>
            <label>Player {turn.toString()}</label>
            <div className="errorMessage">
                {errorMessage &&
                    <p>Wrong calculation. Please try again.</p> }
            </div>
        </div>
            {selectedPiece && <Modal isOpen={showModal} onClose={handleCloseModal} conseqJumpNumbers={conseqJumpNumbers} goal={board[selectedPiece?.x][selectedPiece?.y].value} />}
        </div>

    );
};

export default MathChessBoard;
