import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import SpeechText from './Assets/microphone.png'
import { Avatar } from "@mui/material";

const TextToSpeech = ({ text }) => {

  // Variable to hold and update text used by voice synthesizer
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    // Initialise synth
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u); // Pass text to speek

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => { // Handle play , synth speaks
    const synth = window.speechSynthesis;
    synth.speak(utterance);
  };

  return (
    // TTS is a simple icon button
    <div>
      <Button onClick={handlePlay} startIcon={<Avatar src={SpeechText}  />}></Button>
    </div>
  );
};

export default TextToSpeech;