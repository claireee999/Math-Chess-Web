import React, {FC, ReactNode, useEffect, useState} from 'react';
import "./style.css"

interface ModalProps {
    isOpen: boolean;
    onClose: (shouldSwitch: boolean) => void;
    //numbers: number[];
    conseqJumpNumbers: number[][];
    goal: number;

}

const Modal: FC<ModalProps> = ({ isOpen, onClose, conseqJumpNumbers, goal}) => {
    const [contents, setContents] =  useState<string[][]>([]);
    //const initialUsedNumbers = Array.from({ length: numbers.length }, () => false);
    //const initialUsedNumbers = Array.from({ length: conseqJumpNumbers.length }, () => Array(2).fill(false));

    const [usedNumbers, setUsedNumbers] = useState<boolean[][]>([]);

    const handleReset = () => {
        setContents(Array.from({ length: conseqJumpNumbers.length }, () => []));
        setUsedNumbers(conseqJumpNumbers.map(numbers => (
            Array(numbers.length).fill(false)
        )));
    }

    useEffect(() => {
        handleReset();
    }, [conseqJumpNumbers]);

    const signs = ["+", "-", "\u00d7","\u00f7", "(", ")"];
    const [errorMessage, setErrorMessage] = useState<boolean>(false);

    const handleClickSign = ( sign: string, index: number ) => {
        setContents(prevContent => {
            return prevContent.map((content, i) => {
                if (i === index) {
                    return [...content, sign];
                } else {
                    return content;
                }
            })
        });
    }

    const handleClickNumber = ( listIndex: number, numberIndex: number, number: string ) => {
        setContents(prevContent => {
            return prevContent.map((content, i) => {
                if (i === listIndex) {
                    return [...content, number];
                } else {
                    return content;
                }
            })
        });

        //setContents((prevContent) => [...prevContent, number]);
        setUsedNumbers(prevUsedNumbers => {
            return prevUsedNumbers.map((numbers, row) => (numbers.map((number, col) => {
                if (row === listIndex && col === numberIndex) {
                    return true;
                } else {
                    return number;
                }
            })))
        });


    }
    const handleClear = (index: number) => {
        setContents(prevContent => {
            return prevContent.map((content, i) => {
                if (i === index) {
                    return [];
                } else {
                    return content;
                }
            })
        });
        //setContents ([]);

        setUsedNumbers(prevUsedNumbers => {
            return prevUsedNumbers.map((numbers, row) => (numbers.map((number, col) => {
                if (row === index) {
                    return false;
                } else {
                    return number;
                }
            })))
        });

       // const updatedUsedNumbers = usedNumbers.map(() => false);
        //setUsedNumbers(updatedUsedNumbers);
    }

    const handleDelete = (index: number) => {
        if  (/^\d$/.test(contents[index][contents[index].length - 1])) {
            setUsedNumbers(prevUsedNumbers => {
                return prevUsedNumbers.map((numbers, row) => (numbers.map((number, col) => {
                    if (row === index && col === conseqJumpNumbers[row].indexOf(Number(contents[index][contents[index].length - 1]))) {
                        return false;
                    } else {
                        return number;
                    }
                })))
            });
        }

        setContents(prevContent => {
            return prevContent.map((content, i) => {
                if (i === index) {
                    return content.slice(0, -1);
                } else {
                    return content;
                }
            })
        });
    }

    const handleSubmit = () => {
        if (contents.length === 1) {
            const expression = contents[0].join('').replace('\u00d7', '*').replace(/\u00f7/g, '/');
            const result = eval(expression);
            if (result === goal) {
                onClose(true)
            } else {
                handleClear(0);
                setErrorMessage(true);
            }
        } else {
            const results: number[] = [];
            for (let i = 0; i < contents.length; i++){
                const expression = contents[i].join('').replace('\u00d7', '*').replace(/\u00f7/g, '/');
                const result = eval(expression);
                results.push(result);
            }
            for (let i = 0; i < results.length - 1; i++) {
                if (results[i] !== results[i+1]) {
                    handleReset();
                    setErrorMessage(true);
                    return;
                }
            }
            onClose(true);
        }
    }

    const handleCancel= () => {
        handleReset();
        onClose(false);
    }

    if (!isOpen) {
        return null;
    }


    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Show your calculation:</h2>
                {conseqJumpNumbers.map((numbers, listIndex) => (
                    <>
                        <div className="modal-board">
                            {contents[listIndex].map((content, index) => (
                                    content !== "" && <button key={index}>{content}</button>
                                ))}
                        </div>
                        <div className="signs">
                            {signs.map((sign, index) => (
                                <button key={index} onClick={() => handleClickSign(sign, listIndex)}>
                                    {sign}
                                </button>
                            ))}
                        </div>
                        < div className="numbers">
                            {numbers.map((number, numberIndex) => (
                                !usedNumbers[listIndex][numberIndex] && (
                                <button key={numberIndex}
                                        onClick={() => handleClickNumber(listIndex, numberIndex, String(number))}>
                                    {number}
                                </button>
                            )))}

                        </div>
                        <div>
                            <button className="modal-clear" onClick={() => handleClear(listIndex)}>
                                Clear
                            </button>
                            <button className="modal-delete" onClick={() => handleDelete(listIndex)}>
                                delete
                            </button>
                        </div>
                    </>
                ))}
                <div className="modal-errorMessage">
                    {errorMessage &&
                        <p>Wrong calculation. Please try again.</p> }
                </div>
                <div>
                    <button className="modal-close" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="modal-submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
             </div>
        </div>
    );
};

export default Modal;
