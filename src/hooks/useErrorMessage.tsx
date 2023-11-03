import React, { useState, useEffect } from 'react';

// Custom hook for error messages with a fade-out effect
export const useErrorMessage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout>>();

    const showError = (message: React.SetStateAction<string>, duration = 1500) => {
        setErrorMessage(message);
        setIsVisible(true);
        if (timerId) {
            clearTimeout(timerId);
        }

        const newTimerId = setTimeout(() => {
            hideError();
        }, duration);

        // Store the new timer ID
        setTimerId(newTimerId);
    };

    const hideError = () => {
        setIsVisible(false);
    };

    return {
        errorMessage,
        isVisible,
        showError,
        hideError,
    };
}
