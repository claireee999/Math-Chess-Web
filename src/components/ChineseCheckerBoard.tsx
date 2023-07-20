import React, { useEffect, useState } from 'react';
import {useBoolean} from "@chakra-ui/react";

const ChineseCheckerBoard: React.FC = () => {
    class State {
        // [1, 0-9]: Player1; [2, 0-9]: Player2; [-1, -1]: invalid; [0, -1]: empty
        type: number;
        value: number;
        x: number;
        y: number;
        clicked: boolean;

        constructor(type: number, value: number, x: number, y: number, clicked = false) {
            this.type = type;
            this.value = value;
            this.x = x;
            this.y = y;
            this.clicked = clicked;

        }
    }

    //const [board, setBoard] = useState<number[][][]>([...Array(15)].map(() => Array(15).fill([0,-1])));
    const [board, setBoard] = useState<State[][]>([...Array(15)].map(() => Array(15).fill(new State(0, -1, -1, -1))));

    const player1: string[] = ["#FED7E2", "#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4", "#63B3ED"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const [hasSelected, setHasSelected] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState(null);

    const drawPiece = (x: number, y: number, state: State) => {
        const pieceStyles: { [key: number]: React.CSSProperties } = {
            1: { backgroundColor: player1[1] },
            11: { backgroundColor: player1[2] },
            2: { backgroundColor: player2[0] },
            12: { backgroundColor: player2[1] },
            0: { backgroundColor: empty },
        };

        const style: React.CSSProperties = {
            position: "absolute",
            top: `${y * 70 + 150}px`,
            left: `${x * 70 + 150}px`,
            width: "50px",
            height: "50px",
            lineHeight: "45px",
            borderRadius: "50%",
            ...pieceStyles[state.type],
            textAlign: "center",
            verticalAlign: "middle",
        };

       const textStyle: React.CSSProperties = {
            display:"inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
        };

        const handleClick = () => {
            setBoard((prevBoard) => {
                const updatedBoard = [...prevBoard];
                const currentState = prevBoard[state.x][state.y];
                let newState = new State (currentState.type,currentState.value, currentState.x, currentState.y);
                if (prevBoard[state.x][state.y].type === 1 && !hasSelected) {
                    newState.type = 11;
                    newState.clicked = true;
                    setHasSelected(true);
                    setSelectedPiece(newState);
                } else if (prevBoard[state.x][state.y].type === 1) {
                    if (currentState.clicked) {
                        newState.type = 1;
                        newState.clicked = false;
                    } else {
                        newState.type = 11;
                        newState.clicked = true;
                    }
                } else if (prevBoard[state.x][state.y].type === 2 && !hasSelected) {
                    newState.type = 12;
                    newState.clicked = true;
                    setHasSelected(true);
                } else if (hasSelected){
                }
                updatedBoard[currentState.x][currentState.y] = newState;
                console.log(updatedBoard[currentState.x][currentState.y]);
                return updatedBoard;
            });
        };

        return (
            <div style={style} onClick={handleClick}>
                {state.value >= 0 && <span style={textStyle}>
                    {state.value}</span>}
            </div>
        );
    };

    useEffect(() => {
        const newBoard: State[][] = [...Array(15)].map(() => Array(15).fill(new State(0, -1, -1, -1)));
        //const newBoard = [...Array(15)].map(() => Array(15).fill([0,-1]));

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if ((row + col) % 2 === 0 || Math.abs(row - 7) + Math.abs(col - 7) > 7) {
                    //newBoard[row][col] = -1;
                    newBoard[row][col] = new State(-1, -1, row, col);
                } else if (row < 4) {
                    //newBoard[row][col] = 1;
                    if (row === 0) {
                         newBoard[row][col] = new State(1, 0, row, col);
                    } else if (row === 1) {
                        if (col === 6) newBoard[row][col] = new State(1, 9, row, col);
                        else newBoard[row][col] = new State(1, 8, row, col);
                    } else if (row === 2) {
                        if (col === 5) newBoard[row][col] = new State(1, 5, row, col);
                        else if (col === 7) newBoard[row][col] = new State(1, 6, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(1, 7, row, col);
                    } else if (row === 3) {
                        if (col === 4) newBoard[row][col] = newBoard[row][col] = new State(1, 4, row, col);
                        else if (col === 6) newBoard[row][col] = newBoard[row][col] = new State(1, 3, row, col);
                        else if (col === 8) newBoard[row][col] = newBoard[row][col] = new State(1, 2, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(1, 1, row, col);
                    }
                } else if (row > 10) {
                    if (row === 14) {
                        newBoard[row][col] = new State(2, 0, row, col);
                    } else if (row === 13) {
                        if (col === 6) newBoard[row][col] = new State(2, 8, row, col);
                        else newBoard[row][col] = newBoard[row][col] = new State(2, 9, row, col);
                    } else if (row === 12) {
                        if (col === 5) newBoard[row][col] =newBoard[row][col] = new State(2, 7, row, col);
                        else if (col === 7) newBoard[row][col] = newBoard[row][col] = new State(2, 6, row, col);
                        else newBoard[row][col] = new State(2, 5, row, col);
                    } else if (row === 11) {
                        if (col === 4) newBoard[row][col] = new State(2, 1, row, col);
                        else if (col === 6) newBoard[row][col] = new State(2, 2, row, col);
                        else if (col === 8) newBoard[row][col] = new State(2, 3, row, col);
                        else newBoard[row][col] = new State(2, 1, row, col);
                    }
                }
            }
        }

        setBoard(newBoard);

    }, []);
    console.log(board);

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: background }}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((value, colIndex) => (
                        <div key={colIndex}>
                            {drawPiece(rowIndex, colIndex / 2, value)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChineseCheckerBoard;
