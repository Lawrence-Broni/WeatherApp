import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import Sun from './Assets/sun.png';
import Rain from './Assets/rain.png';
import Drizzle from './Assets/drizzle.png';
import Snow from './Assets/snow.png';
import LocationMarker from './Assets/location_marker.png';
import Storm from './Assets/storm.png';
import Atmosphere from './Assets/atmosphere.png';
import Cloud from './Assets/cloud.png';
import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import TextToSpeech from './TextToSpeech';
import { useParams } from 'react-router-dom';
import { LocationContext, TTSContext } from './App';

const DayForecast= () => {

    // Setup and initialise variables for weather descriptors
	const [temperature, updateTemperature] = useState(0);
	const [feelsLike, updateFeelsLike] = useState(0);
	const [description, updateDescription] = useState('');
    const [imageDescription, updateImageDescription] = useState('');

    // Initialise location variables from location context
	const {longitude, setLongitude} = useContext(LocationContext);
	const {latitude, setLatitude} = useContext(LocationContext);
	const {location, setLocation} = useContext(LocationContext);

    // Initialise TTS state variable from TTS context
    const {TTS, setTTS} = useContext(TTSContext);

    // Initialise variable to hold the TTS speech text
	const [speech, setSpeech] = useState('Speech not yet set');

    // Array used to help process data returned from API call
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Data passed is day selected by user
    const { data } = useParams();

	const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=37ad51421f1c727465cc1c5737df506b`
            );
            // Process API call data into something useable
            const groupedForecasts = response.data.list.reduce((groups, forecast) => {
                const date = new Date(forecast.dt * 1000);
                const d = days[date.getDay()];

                if (!groups[d]) {
                    groups[d] = [];
                }

                groups[d].push(forecast);
                return groups;
            }, {});

            // Extract needed data and return array
            const weekForecastDetail = Object.entries(groupedForecasts).map(([day, forecasts]) => {
                return {
                    day,
                    temp: forecasts[0].main.temp,
                    feelsLike: forecasts[0].main.feels_like,
                    description: forecasts[0].weather[0].description,
                    imageDescription: forecasts[0].weather[0].main
                };
            });
         

            // Get data for day which was selected
            const selectedDay = (weekForecastDetail.find(item => item.day === data)) || weekForecastDetail[0];

            // Update weather descriptor variables from processed data
            updateTemperature(selectedDay.temp);
			updateFeelsLike(selectedDay.feelsLike);
			updateDescription(selectedDay.description);
            updateImageDescription(selectedDay.imageDescription);


            setSpeech("The weather for " + location +
            " is " + temperature + "degrees, " + 
            "and feels like " + feelsLike + "degrees, " + 
            "it is expected to be " + description);

        } catch(error) {
            console.error(error);
        }
    });
	
    useEffect(() => { // Fetch data on page load and when lat or long changes
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

            {/*
                Display users interpreted location
            */}
			<h1>{location}</h1>
			</div>
			<div className='today-position'>
					<div id = "head-more">
                        {/*
                            Diplay weather information
                        */}
						<div>
							<h1>{Math.round(temperature)}°C</h1>
							<h3>Feels like: {Math.round(feelsLike)}°C</h3>
							<h1>{data}</h1>
						</div>


                        {/*
                            Display weather image
                        */}
						<div id = "head-more-image">
							<img id = "image" src = {getImage(imageDescription) || Sun}></img>
						</div>
						</div>
                {/*
                    Text to speech button
                */}
				<div id='speech-button'>
					<ThemeProvider theme = {theme2}>
						{TTS && // render only if tts is enabled
							<TextToSpeech id = 'tts' text={speech}/>
						}
					</ThemeProvider>
				</div>
			</div>
		</div>
		
	);
}


export default DayForecast;