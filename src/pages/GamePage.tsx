import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import MathChessBoard from "../components/MathChessBoard";

type HomePageProps = {
    onStartGame: () => void;
};

const GamePage: React.FC = ({}) => {
    const gradient = 'linear-gradient(45deg, #FF0080, #7928CA)';

    const headingStyle: React.CSSProperties = {
        colorScheme: gradient,
        WebkitBackgroundClip: 'text',
        textAlign: 'center',
        marginTop: '4',
        fontSize: '50px',
        fontFamily: 'cursive',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
    };

    return (
        <div>
            <MathChessBoard />
        </div>
    );
};

export default GamePage;

