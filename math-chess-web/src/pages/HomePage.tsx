import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

type HomePageProps = {
    onStartGame: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
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

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        marginTop: '-5vh',
    };

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: '8px',
    };

    const buttonStyle: React.CSSProperties = {
        width: '200px',
        colorScheme: '#CBD5E0',
        fontSize: 'lg',
        fontWeight:'4px',
        marginTop: '4px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
    };


    return (
        <div style={containerStyle}>
            <Heading as="h1" size="2xl" style={headingStyle}>
                Math Chess
            </Heading>
            <div style={buttonContainerStyle}>
            <Button >
                Start
            </Button>
            <Button style={buttonStyle}>
                Settings
            </Button>
            </div>
    </div>
    );
};

export default HomePage;

