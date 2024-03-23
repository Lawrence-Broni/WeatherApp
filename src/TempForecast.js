import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';

import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import TextToSpeech from './TextToSpeech';
import { LocationContext, TTSContext } from './App';
import { useParams } from 'react-router-dom';

const TempForecast= () => {

    // Get location context variables
	const {longitude, setLongitude} = useContext(LocationContext);
	const {latitude, setLatitude} = useContext(LocationContext);
	const {location, setLocation} = useContext(LocationContext);

    // Initialize weather descriptor variables
    const [description, updateDescription] = useState('');
    const [highTemp, setHighTemp] = useState(0);
    const [lowTemp, setLowTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wind, setWind] = useState(0);

    // Initialize variable which holds TTS text
    const [speech, setSpeech] = useState('TTS not yet set');

    // Initialise TTS state variable from TTS context
    const {TTS, setTTS} = useContext(TTSContext);

    // Array used for processing returned API call data
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Data passed is day selected by user
    const { data } = useParams();

	const fetchData = useCallback(async () => {
        try {
            const response = await axios.get( // API Call
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
                    high: forecasts[0].main.temp_max,
                    low: forecasts[0].main.temp_min,
                    humidity: forecasts[0].main.humidity,
                    wind: forecasts[0].wind.speed,
                    description: forecasts[0].weather[0].description,
                };
            });
            //console.log(weekForecastDetail);

            // Get data for day which was selected
            const selectedDay = (weekForecastDetail.find(item => item.day === data)) || weekForecastDetail[0];
            updateDescription(selectedDay.description); // Update the description
            setHighTemp(selectedDay.high); // Update new high temperature
            setLowTemp(selectedDay.low); // Update new low temperature
            setHumidity(selectedDay.humidity); // Update new humidity
            setWind(selectedDay.wind); // Update new wind speed

            // Set TTS text
            setSpeech("The weather for " + location + " is "+description+
            "and has a high of" + highTemp + "degrees celsius," + 
					"and a low of " + lowTemp + "degrees" + 
					"and a humidity of " + humidity +
                    "and a wind speed of "+ wind);
            
        } catch(error) {
            console.error(error);
        }
    });
	
    useEffect(() => { // Call this function on page load, or when effect triggered
        fetchData(); // Fetch new data request each time
    }, [longitude, latitude]); // Update data if longitude or latitude change

	return (
            <div className = "temp">
                <div id = "temp-item">
                    <h1>Description</h1>
                    <p>{description}</p>
                </div>
                <div id = "temp-item">
                    <h1>High</h1>
                    <p>{Math.round(highTemp)}°C</p>
                </div>
                <div id = "temp-item">
                    <h1>Low</h1>
                    <p>{Math.round(lowTemp)}°C</p>
                </div>
                <div id = "temp-item">
                    <h1>Humidity</h1>
                    <p>{humidity}%</p>
                </div>
                <div id = "temp-item">
                    <h1>Wind</h1>
                    <p>{wind}km/h</p>
                </div>

                <div id="button-speech-day">
                <ThemeProvider theme = {theme2}>
                    { TTS && // render only if TTS is enabled
                    <TextToSpeech id = 'tts' text={speech}/>
                    }
			  </ThemeProvider>
                </div>
            </div>
	);
}

export default TempForecast;