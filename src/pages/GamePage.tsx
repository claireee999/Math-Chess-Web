import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

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
            <Heading as="h1" size="2xl" style={headingStyle}>
               Game
            </Heading>
        </div>
    );
};

export default GamePage;

