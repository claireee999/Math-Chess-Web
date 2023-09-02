import React, { useEffect, useState } from 'react';
import {Button, useBoolean} from "@chakra-ui/react";
import { initialBoard } from './initialBoard';

enum Player {
    EMPTY,
    PLAYER1,
    PLAYER2,
    NONE
}

class Piece {
    // [1, 0-9]: Player1; [2, 0-9]: Player2; [-1, -1]: invalid; [0, -1]: empty
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

const boardModel: Piece[][] = [...Array(15)].map(() => Array(15).fill(new Piece(Player.EMPTY, -1, -1, -1)));
const initializeBoard = () => {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            boardModel[i][j] = initialBoard[i][j];
        }
    }
    console.log(initialBoard)
    console.log(boardModel);
}

const turnHistory: { oldX: number; oldY: number; newX: number; newY: number; }[] = [];
const boardHistory = [];

const ChineseCheckerBoard: React.FC = () => {
    const [board, setBoard] = useState<Piece[][]>(boardModel);
    const [turn, setTurn] = useState<Player>(Player.PLAYER1);
    const [hasMoved, setHasMoved] = useState(false);

    const player1: string[] = ["#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number}>();
    const [highlightPiece, setHighlightPiece] = useState<{x: number, y: number}[]>([]);

     const findValidMoves = (x: number, y: number) => {
          const validMoves: {x: number, y: number}[] = [];
          let isJumpEnabled = false;
          for (let i = 1; y - i >= 0; i++) {
              if (boardModel[x][y - i].player === Player.PLAYER1 || boardModel[x][y - i].player === Player.PLAYER2) {
                  isJumpEnabled = true;
              }
              if (boardModel[x][y - i].player === Player.EMPTY){
                  if (isJumpEnabled) {
                      validMoves.push({x, y: y - i});
                  }
                  break;
              }
          }

          isJumpEnabled = false;
          for (let i = 1; y + i < 15; i++){
              if (boardModel[x][y + i].player === Player.PLAYER1 || boardModel[x][y + i].player === Player.PLAYER2) {
                  isJumpEnabled = true;
              }
              if (boardModel[x][y + i].player === Player.EMPTY){
                  if (isJumpEnabled) {
                      validMoves.push({x, y: y + i});
                  }
                  break;
              }
          }

         isJumpEnabled = false;
         for (let i = 1; x + i < 15 && y - i >= 0; i++) {
             if (boardModel[x + i][y - i].player === Player.PLAYER1 || boardModel[x + i][y - i].player === Player.PLAYER2) {
                 isJumpEnabled = true;
             }
             if (boardModel[x + i][y - i].player === Player.EMPTY) {
                 if (isJumpEnabled) {
                     validMoves.push({x: x + i, y: y - i});
                 }
                 break;
             }
         }

         isJumpEnabled = false;
         for (let i = 1; x + i < 15 && y + i < 15; i++){
             if (boardModel[x + i][y + i].player === Player.PLAYER1 || boardModel[x + i][y + i].player === Player.PLAYER2) {
                 isJumpEnabled = true;
             }
             if (boardModel[x + i][y + i].player === Player.EMPTY) {
                 if (isJumpEnabled) {
                     validMoves.push({x: x + i, y: y + i});
                 }
                 break;
             }
         }

         isJumpEnabled = false;
         for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
             if (boardModel[x - i][y - i].player === Player.PLAYER1 || boardModel[x - i][y - i].player === Player.PLAYER2) {
                 isJumpEnabled = true;
             }
             if (boardModel[x - i][y - i].player === Player.EMPTY){
                 if (isJumpEnabled) {
                     validMoves.push({x: x - i, y: y - i});
                 }
                 break;
             }
         }

         isJumpEnabled = false;
         for (let i = 1; x - i >= 0 && y + i < 15; i++){
             if (x+1 >=15) break;
             if (boardModel[x - i][y + i].player === Player.PLAYER1 || boardModel[x - i][y + i].player === Player.PLAYER2) {
                 isJumpEnabled = true;
             }
             if (boardModel[x - i][y + i].player === Player.EMPTY){
                 if (isJumpEnabled) {
                     validMoves.push({x: x - i, y: y + i});
                 }
                 break;
             }
         }

          return validMoves;
     }


    const movePiece = (oldPiece: { x: number; y: number }, newX: number, newY: number) => {
        const movingPiece = boardModel[oldPiece.x][oldPiece.y];
        boardModel[newX][newY] = new Piece(movingPiece.player, movingPiece.value, newX, newY, true);
        boardModel[oldPiece.x][oldPiece.y] = new Piece(Player.EMPTY, -1, oldPiece.x, oldPiece.y);
        turnHistory.push({oldX: oldPiece.x, oldY: oldPiece.y, newX, newY});
        setSelectedPiece({x: newX, y: newY})
        setHighlightPiece(findValidMoves(newX, newY));
        setHasMoved(true);
        //setBoard([...boardModel]);
        //setMoveStack([...moveStack.slice(0, currentMove + 1), newBoard]);
        return true;
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
        //const newBoard = [...Array(15)].map(() => Array(15).fill([0,-1]));
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
        setBoard([...boardModel]);
    }

    const switchTurn = () => {
        if (turnHistory.length > 0) {
            boardHistory.push({oldX: turnHistory[0].oldX, oldY: turnHistory[0].oldY, newX: turnHistory[turnHistory.length - 1].newX, newY: turnHistory[turnHistory.length - 1].newY})
        }
        if (turn === Player.PLAYER1) {
            setTurn(Player.PLAYER2)
        } else {
            setTurn(Player.PLAYER1)
        }
        setHasMoved(false);
        if (selectedPiece) {
            boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
        }
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
        setBoard([...boardModel]);
    }

    const restartTurn = () => {
        if (turnHistory.length > 0) {
            const movingPiece = boardModel[turnHistory[turnHistory.length - 1].newX][turnHistory[turnHistory.length - 1].newY];
            boardModel[turnHistory[turnHistory.length - 1].newX][turnHistory[turnHistory.length - 1].newY] = new Piece(Player.EMPTY, -1, turnHistory[turnHistory.length - 1].newX, turnHistory[turnHistory.length - 1].newY);
            boardModel[turnHistory[0].oldX][turnHistory[0].oldY] = new Piece(movingPiece.player, movingPiece.value, turnHistory[0].oldX, turnHistory[0].oldY);
        }
        turnHistory.length = 0;
        if (selectedPiece) {
            boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
        }
        setSelectedPiece(undefined);
        highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
        setHighlightPiece([]);
        setHasMoved(false);
        setBoard([...boardModel]);
    }

    return (
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
            <Button onClick={switchTurn}>
                Next
            </Button>
            <Button onClick={restartTurn}>
                Reset
            </Button>
        </div>
    );
};

export default ChineseCheckerBoard;
