import React, {FC, ReactNode, useState} from 'react';
import "./style.css"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    numbers: number[];

}

const Modal: FC<ModalProps> = ({ isOpen, onClose, numbers}) => {
    const [contents, setContents] =  useState<string[]>([]);
    const initialUsedNumbers = Array.from({ length: numbers.length }, () => false);
    const [usedNumbers, setUsedNumbers] = useState<boolean[]>(initialUsedNumbers);
    const signs = ["+", "-", "\u00d7","\u00f7", "(", ")"];


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

                <button className="modal-close" onClick={onClose}>
                    Cancel
                </button>
                <button className="modal-submit" onClick={onClose}>
                    Sumbit
                </button>

            </div>
        </div>
    );
};

export default Modal;
