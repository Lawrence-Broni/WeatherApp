import React, { useEffect, useState, useCallback, useContext } from 'react';

import axios from 'axios';
import Sun from './Assets/sun.png';
import Rain from './Assets/rain.png';
import Drizzle from './Assets/drizzle.png';
import Snow from './Assets/snow.png';
import Storm from './Assets/storm.png';
import Atmosphere from './Assets/atmosphere.png';
import Cloud from './Assets/cloud.png';
import LocationMarker from './Assets/location_marker.png';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import TextToSpeech from './TextToSpeech';
import { LocationContext, TTSContext } from './App';

const TodayForecast= () => {

	// Variables to hold weather descriptors
	const [temperature, updateTemperature] = useState(0);
	const [feelsLike, updateFeelsLike] = useState(0);
	const [description, updateDescription] = useState('');

	// Initialise location variables from location context
	const {longitude, setLongitude} = useContext(LocationContext);
	const {latitude, setLatitude} = useContext(LocationContext);
	const {location, setLocation} = useContext(LocationContext);

	// Initialise TTS state variable from TTS context
    const {TTS, setTTS} = useContext(TTSContext);

	// Initialise variable to hold the TTS speech text
	const [speech, setSpeech] = useState('Speech not yet set');

	// Variable to hold the string of "Today", used for routing purposes
	const today = "Today";

	const fetchData = useCallback(async () => {
        try {
            const response = await axios.get( // API Call
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=37ad51421f1c727465cc1c5737df506b`
            );
			//console.log("response data: ", response.data);

			// Update weather descriptor variables with returned data
			updateTemperature(response.data.main.temp);
			updateFeelsLike(response.data.main.feels_like);
			updateDescription(response.data.weather[0].main);

			// Set text for TTS
            setSpeech("The weather for " + location +
            " is " + response.data.main.temp + "degrees, " + 
            "and feels like " + response.data.main.feels_like + "degrees, " + 
            "it is expected to be " + response.data.weather[0].main);

        } catch(error) {
            console.error(error);
        }
    });
	
    useEffect(() => { // Fetch data when page loads or when long or lat changes
        fetchData();
    }, [longitude, latitude]);

	// Dictionary to translate weather description to image
	const descToImage = {
        'Rain': Rain,
		'Drizzle': Drizzle,
		'Clouds': Cloud,
		'Clear': Sun,
		"Snow": Snow, 
		'Atmosphere': Atmosphere,
		'Thunderstorm': Storm, 
    };

	// Return image from forecast description
    const getImage = (forecastDescription) => {
        return descToImage[forecastDescription] || Sun;
    }
	return (
		<div className = "head">
			<div id = "head-loc">
			<img id = "location-icon" src = {LocationMarker}></img>
			<h1>{location}</h1>
			</div>
			<div className='today-position'>
				{/*
					Link to display additional info for today
				*/}
				<Link to={`/temp/${today}`}>
					<div id = "head-more">
						<div>

							{/*
								Display weather information
							*/}
							<h1>{Math.round(temperature)}°C</h1>
							<h3>Feels like: {Math.round(feelsLike)}°C</h3>
							<h1>Today</h1>
						</div>
						<div id = "head-more-image">
							{/*
								Display weather icon
							*/}
							<img id = "image" src = {getImage(description) || Sun}></img>
						</div>
						</div>
				</Link>

				{/*
					Text to speech button
				*/}
				<div id='speech-button'>
					<ThemeProvider theme = {theme2}>
						{TTS && // only render if tts is true
							<TextToSpeech id = 'tts' text={speech}/>
						}
					</ThemeProvider>
				</div>
			</div>
		</div>
		
	);
}


export default TodayForecast;