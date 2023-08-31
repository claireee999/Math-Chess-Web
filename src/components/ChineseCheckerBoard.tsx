import React, { useEffect, useState } from 'react';
import {Button, useBoolean} from "@chakra-ui/react";

enum Player {
    EMPTY,
    PLAYER1,
    PLAYER2,
    NONE
}

enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    UPLEFT = 'UPLEFT',
    UPRIGHT = 'UPRIGHT',
    DOWNLEFT = 'DOWNLEFT',
    DOWNRIGHT = 'DOWNRIGHT'
}
class Piece {
    // [1, 0-9]: Player1; [2, 0-9]: Player2; [-1, -1]: invalid; [0, -1]: empty
    player: Player;
    value: number;
    x: number;
    y: number;
    clicked: boolean;
    highlight: boolean;

    constructor(player: Player, value: number, x: number, y: number, clicked = false, highlight = false) {
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
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            if ((row + col) % 2 === 0 || Math.abs(row - 7) + Math.abs(col - 7) > 7) {
                boardModel[row][col] = new Piece(Player.NONE, -1, row, col);
            } else if (row < 4) {
                if (row === 0) {
                    boardModel[row][col] = new Piece(Player.PLAYER1, 0, row, col);
                } else if (row === 1) {
                    if (col === 6) boardModel[row][col] = new Piece(Player.PLAYER1, 9, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER1, 8, row, col);
                } else if (row === 2) {
                    if (col === 5) boardModel[row][col] = new Piece(Player.PLAYER1, 5, row, col);
                    else if (col === 7) boardModel[row][col] = new Piece(Player.PLAYER1, 6, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER1, 7, row, col);
                } else if (row === 3) {
                    if (col === 4) boardModel[row][col] = new Piece(Player.PLAYER1, 4, row, col);
                    else if (col === 6) boardModel[row][col] = new Piece(Player.PLAYER1, 3, row, col);
                    else if (col === 8) boardModel[row][col] = new Piece(Player.PLAYER1, 2, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER1, 1, row, col);
                }
            } else if (row > 10) {
                if (row === 14) {
                    boardModel[row][col] = new Piece(Player.PLAYER2, 0, row, col);
                } else if (row === 13) {
                    if (col === 6) boardModel[row][col] = new Piece(Player.PLAYER2, 8, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER2, 9, row, col);
                } else if (row === 12) {
                    if (col === 5) boardModel[row][col] = new Piece(Player.PLAYER2, 7, row, col);
                    else if (col === 7) boardModel[row][col] = new Piece(Player.PLAYER2, 6, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER2, 5, row, col);
                } else if (row === 11) {
                    if (col === 4) boardModel[row][col] = new Piece(Player.PLAYER2, 1, row, col);
                    else if (col === 6) boardModel[row][col] = new Piece(Player.PLAYER2, 2, row, col);
                    else if (col === 8) boardModel[row][col] = new Piece(Player.PLAYER2, 3, row, col);
                    else boardModel[row][col] = new Piece(Player.PLAYER2, 4, row, col);
                }
            } else  boardModel[row][col] = new Piece(Player.EMPTY, -1, row, col);
        }
    }
}

const ChineseCheckerBoard: React.FC = () => {
    const [board, setBoard] = useState<Piece[][]>(boardModel);
    console.log(board);
    const [boardHistory, setBoardHistory] = useState([]);

    const player1: string[] = ["#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number}>();
    const [highlightPiece, setHighlightPiece] = useState<{x: number, y: number}[]>([]);

     const findValidMoves = (x: number, y: number) => {
         const validMoves: {x: number, y: number}[] = []
          for (let i = y; i >=0; i--) {
              if (boardModel[x][i].player === Player.NONE){
                  break;
              }
              if (boardModel[x][i].player === Player.EMPTY){
                  validMoves.push({x, y: i});
                  break;
              }
          }

          for (let i = y; i <=15; i++){
              if (boardModel[x][i].player === Player.NONE){
                  break;
              }
              if (boardModel[x][i].player === Player.EMPTY){
                  validMoves.push({x, y: i});
                  break;
              }
          }

         for (let i = y-1; i >=0; i--) {
             if (boardModel[x-1][i].player === Player.NONE){
                 break;
             }
             if (boardModel[x-1][i].player === Player.EMPTY){
                 validMoves.push({x: x-1, y: i});
                 break;
             }
         }

         for (let i = y+1; i <=15; i++){
             if (boardModel[x-1][i].player === Player.NONE){
                 break;
             }
             if (boardModel[x-1][i].player === Player.EMPTY){
                 validMoves.push({x: x-1, y: i});
                 break;
             }
         }

         for (let i = y-1; i >=0; i--) {
             if (x+1 >=15) break;
             if (boardModel[x+1][i].player === Player.NONE){
                 break;
             }
             if (boardModel[x+1][i].player === Player.EMPTY){
                 console.log(x, y)
                 console.log(x + 1, i)
                 validMoves.push({x: x+1, y: i});
                 break;
             }
         }

         for (let i = y+1; i <=15; i++){
             if (x+1 >=15) break;
             if (boardModel[x+1][i].player === Player.NONE){
                 break;
             }
             if (boardModel[x+1][i].player === Player.EMPTY){
                 validMoves.push({x: x+1, y: i});
                 break;
             }
         }

          return validMoves;
     }


    const movePiece = (oldPiece: { x: number; y: number }, newX: number, newY: number) => {
        const movingPiece = boardModel[oldPiece.x][oldPiece.y];
        boardModel[newX][newY] = new Piece(movingPiece.player, movingPiece.value, newX, newY);
        boardModel[oldPiece.x][oldPiece.y] = new Piece(Player.EMPTY, -1, oldPiece.x, oldPiece.y);
        setSelectedPiece(undefined);
        setBoard([...boardModel]);
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
            if (piece.player === Player.EMPTY) {
                if (selectedPiece){
                   if (true){
                       movePiece(selectedPiece, x, y);
                       //change player

                   }
                }
                return
            }
            if (selectedPiece) {
                boardModel[selectedPiece?.x][selectedPiece?.y].clicked = false;
            }
            highlightPiece.forEach(piece => boardModel[piece.x][piece.y].highlight = false);
            if (selectedPiece?.x === x && selectedPiece?.y === y) {
                setSelectedPiece(undefined);
                setHighlightPiece([]);
            } else {
                setSelectedPiece({x, y});
                setHighlightPiece(findValidMoves(x, y));
            }
        };

        if (piece.highlight) {
            console.log(style)
        }

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

    const resetBoard = () => {
        initializeBoard();
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
        </div>
    );
};

export default ChineseCheckerBoard;
