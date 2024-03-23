import React, { useEffect, useState, useCallback, useContext } from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material';
import theme from './CustomTheme';
import { FontContext } from './App';
import Checkbox from '@mui/material/Checkbox';
import { LocationContext, TTSContext } from './App';

const SettingsPage= () => {

    // Import font sizes from FontContext
    const {h1FontSize, setH1FontSize} = useContext(FontContext);
    const {h2FontSize, setH2FontSize} = useContext(FontContext); 
    const {pFontSize, setPFontSize} = useContext(FontContext); 

    // Import TTS state for the TTSContext
    const {TTS, setTTS} = useContext(TTSContext);
    
    // Inverts TTS state when called
    const toggleTTS = () => {
        if (TTS) {
            setTTS(false);
        } else {
            setTTS(true);
        }
    };

    // Increase font size by 0.1em when called
    const increaseFontSize = () => {
        setH1FontSize(prevFontSize => prevFontSize + 0.1);
        setH2FontSize(prevFontSize => prevFontSize + 0.1);
        setPFontSize(prevFontSize => prevFontSize + 0.1);
    };

    // Decreases font size by 0.1em when called
    const decreaseFontSize = () => {
        setH1FontSize(prevFontSize => prevFontSize - 0.1);
        setH2FontSize(prevFontSize => prevFontSize - 0.1);
        setPFontSize(prevFontSize => prevFontSize - 0.1);  
    };

	return (
        <div id = 'settings-page'>
            {/*
                Set theme for mui buttons
            */}
            <ThemeProvider theme = {theme}>
                <h2>Settings Page</h2>
                <hr></hr>

                {/*
                    Font settings

                    Allows user to increase or decrease font size
                */}
                <h2>Font Settings</h2>
                <div id = 'font-btns'>
                    <Button variant="contained" onClick={increaseFontSize}>Increase Font Size</Button>
                    <Button variant="contained" onClick={decreaseFontSize}>Decrease Font Size</Button>
                </div>
                <hr></hr>

                {/*
                    TTS settings

                    Allows user to toggle TTS buttons
                */}
                <h2>TTS Settings</h2>
                <div id = 'tts-settings'>
                    <p>
                    TTS: {TTS ? (
                        'Enabled'
                    ) : (
                        'Disabled'
                    )}
                    </p>
                    <Button variant="contained" onClick={toggleTTS}>Toggle Text to Speech</Button>
                </div>
            </ThemeProvider>
        </div>
	);
}


export default SettingsPage;