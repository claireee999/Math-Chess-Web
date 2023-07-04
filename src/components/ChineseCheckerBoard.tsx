import React, { useEffect, useRef } from 'react';

const ChineseCheckerBoard: React.FC = () => {
    const board = useRef<number[][]>(new Array(17));

    const player1: string[] = ["#FED7E2", "#FBB6CE", "#F687B3"];
    const player2: string[] = ["#BEE3F8", "#90CDF4", "#63B3ED"];
    const empty: string = "#FFFFFF";
    const background: string = "#FED7E2";

    const drawPiece = (x: number, y: number, color: number) => {
        const pieceStyles: { [key: number]: React.CSSProperties } = {
            1: { backgroundColor: player1[1] },
            2: { backgroundColor: player2[0] },
            0: { backgroundColor: empty },
        };

        const style: React.CSSProperties = {
            position: "absolute",
            top: `${y * 65}px`,
            left: `${x * 65}px`,
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            ...pieceStyles[color],
        };

        return <div style={style} />;
    };

    useEffect(() => {
        for (let row = 0; row < 15; row++) {
            board.current[row] = new Array(15).fill(0);
        }

        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if ((row + col) % 2 === 0 || Math.abs(row - 7) + Math.abs(col - 7) > 7) {
                    board.current[row][col] = -1;
                } else if (row < 4) {
                    board.current[row][col] = 1;
                } else if (row > 10) {
                    board.current[row][col] = 2;
                }
            }
        }
    }, []);
    console.log(board);

    return (
        <div style={{ position: "relative",  justifyContent: 'center', alignItems: 'center', width: "100vw", height: "100vh", backgroundColor: background }}>
            {board.current.map((row, rowIndex) => (
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
