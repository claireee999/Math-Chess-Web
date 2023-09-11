import React, {FC, ReactNode, useState} from 'react';
import "./style.css"

interface ModalProps {
    isOpen: boolean;
    onClose: (shouldSwitch: boolean) => void;
    numbers: number[];
    goal: number;

}

const Modal: FC<ModalProps> = ({ isOpen, onClose, numbers, goal}) => {
    const [contents, setContents] =  useState<string[]>([]);
    const initialUsedNumbers = Array.from({ length: numbers.length }, () => false);
    const [usedNumbers, setUsedNumbers] = useState<boolean[]>(initialUsedNumbers);
    const signs = ["+", "-", "\u00d7","\u00f7", "(", ")"];
    const [errorMessage, setErrorMessage] = useState<boolean>(false);


    const handleClickSign = ( sign: string ) => {
        setContents((prevContent) => [...prevContent, sign]);
    }

    const handleClickNumber = ( index: number, number: string ) => {
        setContents((prevContent) => [...prevContent, number]);
        const updatedUsedNumbers = [...usedNumbers];
        updatedUsedNumbers[index] = true;
        setUsedNumbers(updatedUsedNumbers);


    }
    const handleClear = () => {
        setContents ([]);
        const updatedUsedNumbers = usedNumbers.map(() => false);
        setUsedNumbers(updatedUsedNumbers);

    }
    const handleDelete = () => {
        if  (/^\d$/.test(contents[contents.length - 1])) {
            console.log(contents[contents.length - 1]);
            const updatedUsedNumbers = [...usedNumbers];
            updatedUsedNumbers[numbers.indexOf(Number(contents[contents.length - 1]))] = false;
            setUsedNumbers(updatedUsedNumbers);
        }
        setContents((prevContent) => prevContent.slice(0, -1));
    }

    const handleSumbit = () => {
        const expression = contents.join('').replace('\u00d7', '*').replace(/\u00f7/g, '/');
        const result = eval(expression);
        console.log(result);
        if (result === goal) {
            onClose(true)
        } else {
            handleClear();
            setErrorMessage(true);
        }

    }

    if (!isOpen) {
        return null;
    }


    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Show your calculation:</h2>
                <div className="modal-board">
                    {contents.map((content, index) => (
                        <button key={index}>{content}</button>
                    ))}

                </div>
                <div className="signs">
                    {signs.map((sign, index) => (
                        <button key={index} onClick={() => handleClickSign(sign)}>
                            {sign}
                        </button>
                    ))}
                </div>
                <div className="modal-errorMessage">
                    {errorMessage &&
                        <p>Wrong calculation. Please try again.</p> }
                </div>

                < div className="numbers">
                    {numbers.map((number, index) => (
                        !usedNumbers[index] && (
                        <button key={index} onClick={() => handleClickNumber(index, String(number))}>
                            {number}
                        </button>
                        )
                    ))}

                </div>
                <button className="modal-clear" onClick={handleClear}>
                    Clear
                </button>
                <button className="modal-delete" onClick={handleDelete}>
                    delete
                </button>

                <button className="modal-close" onClick={() => onClose(false)}>
                    Cancel
                </button>
                <button className="modal-submit" onClick={handleSumbit}>
                    Sumbit
                </button>

            </div>
        </div>
    );
};

export default Modal;
