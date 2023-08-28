import React, { useEffect, useState } from 'react';
import {useBoolean} from "@chakra-ui/react";

enum Player {
    PLAYER1,
    PLAYER2,
    EMPTY,
    NONE
}
const ChineseCheckerBoard: React.FC = () => {
    class State {
        // [1, 0-9]: Player1; [2, 0-9]: Player2; [-1, -1]: invalid; [0, -1]: empty
        player: Player;
        value: number;
        x: number;
        y: number;
        clicked: boolean;

        constructor(player: Player, value: number, x: number, y: number, clicked = false) {
            this.player = player;
            this.value = value;
            this.x = x;
            this.y = y;
            this.clicked = clicked;
        }
    }

    //const [board, setBoard] = useState<number[][][]>([...Array(15)].map(() => Array(15).fill([0,-1])));
    const [board, setBoard] = useState<State[][]>([...Array(15)].map(() => Array(15).fill(new State(Player.NONE, -1, -1, -1))));

    const player1: string[] = ["#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const [selectedPiece, setSelectedPiece] = useState<{x: number, y: number}>();

    const drawPiece = (x: number, y: number, state: State) => {
        const pieceStyles: { [key in Player]: string } = {
            [Player.PLAYER1]: player1[Number(state.clicked)],
            [Player.PLAYER2]: player2[Number(state.clicked)],
            [Player.NONE]: 'transparent',
            [Player.EMPTY]: empty
        };

        const style: React.CSSProperties = {
            position: "absolute",
            top: `${y * 35 + 150}px`,
            left: `${x * 70 + 150}px`,
            width: "50px",
            height: "50px",
            lineHeight: "45px",
            borderRadius: "50%",
            backgroundColor: pieceStyles[state.player],
            textAlign: "center",
            verticalAlign: "middle",
        };

       const textStyle: React.CSSProperties = {
            display:"inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
        };

        const handleClick = () => {
            if (state.player === Player.NONE) {
                return
            }
            if (selectedPiece?.x === x && selectedPiece?.y === y) {
                setSelectedPiece(undefined);
            } else {
                setSelectedPiece({x, y});
            }
        };

        return (
            <div style={style} onClick={handleClick}>
                {state.value >= 0 && <span style={textStyle}>
                    {state.value}</span>}
            </div>
        );
    };

    useEffect(() => {
        const newBoard: State[][] = [...Array(15)].map(() => Array(15).fill(new State(Player.EMPTY, -1, -1, -1)));
        //const newBoard = [...Array(15)].map(() => Array(15).fill([0,-1]));

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if ((row + col) % 2 === 0 || Math.abs(row - 7) + Math.abs(col - 7) > 7) {
                    //newBoard[row][col] = -1;
                    newBoard[row][col] = new State(Player.NONE, -1, row, col);
                } else if (row < 4) {
                    //newBoard[row][col] = 1;
                    if (row === 0) {
                         newBoard[row][col] = new State(Player.PLAYER1, 0, row, col);
                    } else if (row === 1) {
                        if (col === 6) newBoard[row][col] = new State(Player.PLAYER1, 9, row, col);
                        else newBoard[row][col] = new State(Player.PLAYER1, 8, row, col);
                    } else if (row === 2) {
                        if (col === 5) newBoard[row][col] = new State(Player.PLAYER1, 5, row, col);
                        else if (col === 7) newBoard[row][col] = new State(Player.PLAYER1, 6, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER1, 7, row, col);
                    } else if (row === 3) {
                        if (col === 4) newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER1, 4, row, col);
                        else if (col === 6) newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER1, 3, row, col);
                        else if (col === 8) newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER1, 2, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER1, 1, row, col);
                    }
                } else if (row > 10) {
                    if (row === 14) {
                        newBoard[row][col] = new State(Player.PLAYER2, 0, row, col);
                    } else if (row === 13) {
                        if (col === 6) newBoard[row][col] = new State(Player.PLAYER2, 8, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER2, 9, row, col);
                    } else if (row === 12) {
                        if (col === 5) newBoard[row][col] =newBoard[row][col] = new State(Player.PLAYER2, 7, row, col);
                        else if (col === 7) newBoard[row][col] = newBoard[row][col] = new State(Player.PLAYER2, 6, row, col);
                        else newBoard[row][col] = new State(Player.PLAYER2, 5, row, col);
                    } else if (row === 11) {
                        if (col === 4) newBoard[row][col] = new State(Player.PLAYER2, 1, row, col);
                        else if (col === 6) newBoard[row][col] = new State(Player.PLAYER2, 2, row, col);
                        else if (col === 8) newBoard[row][col] = new State(Player.PLAYER2, 3, row, col);
                        else newBoard[row][col] = new State(Player.PLAYER2, 4, row, col);
                    }
                }
            }
        }

        if (selectedPiece) {
            newBoard[selectedPiece.x][selectedPiece.y].clicked = true;
        }
        setBoard(newBoard);

    }, [selectedPiece]);
    console.log(board);

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
        </div>
    );
};

export default ChineseCheckerBoard;
