import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import MathChessBoard from "../components/MathChessBoard";

type HomePageProps = {
    onStartGame: () => void;
};

const GamePage: React.FC = ({}) => {

    return (
        <div>
            <MathChessBoard />
        </div>
    );
};

export default GamePage;

