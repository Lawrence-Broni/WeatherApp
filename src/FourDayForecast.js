import './App.css';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sun from './Assets/sun.png';
import Rain from './Assets/rain.png';
import Drizzle from './Assets/drizzle.png';
import Snow from './Assets/snow.png';
import { LocationContext, TTSContext, DayContext } from './App';
import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import TextToSpeech from './TextToSpeech';
import Storm from './Assets/storm.png';
import Atmosphere from './Assets/atmosphere.png';
import Cloud from './Assets/cloud.png';


const FourDayForecast = () => {
  // Variable to hold returned data from API
  const [forecastData, setForecastData] = useState(null);

  // Initialise location variables from location context
  const { longitude, setLongitude } = useContext(LocationContext);
  const { latitude, setLatitude } = useContext(LocationContext);

  // Initialise TTS state variable from TTS context
  const {TTS, setTTS} = useContext(TTSContext);

  // Initialise variable to hold the TTS speech text
  const [speech, setSpeech] = useState('Speech not yet set');

  // Variable to hold API key
  const apiKey = '7c1355aa38da1917d09a77f407d41409';

  // Array used to help process data returned from API call
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  const fetchData = useCallback(async () => {
    try {
      const forecastResponse = await axios.get( // Make API call
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=37ad51421f1c727465cc1c5737df506b`
      );

      // calculate the maximum temperature for each day
      const groupedForecasts = forecastResponse.data.list.reduce((groups, forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = days[date.getDay()];

        if (!groups[day]) {
          groups[day] = [];
        }

        groups[day].push(forecast);

        return groups;
      }, {});

      // Return the max temperature for each day
      const maxTempForecasts = Object.entries(groupedForecasts).map(([day, forecasts]) => {
        const maxTemp = Math.max(...forecasts.map(forecast => forecast.main.temp));
        return {
          day,
          temp: maxTemp,
          description: forecasts[0].weather[0].main,
        };
      });

      setForecastData(maxTempForecasts.slice(1, 5)); //forecast for the next 4 days

      // Set speech text needed for TTS
      setSpeech(forecastData.map((forecast, index) => ( "The temperature for "+forecast.day+" is "
        +Math.round(forecast.temp.toFixed(2))+" degrees and it is expected to be"+ forecast.description+",")
          ));
            
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => { // Fetch data on page load and when long or lat changes
    fetchData();
  }, [longitude, latitude]);

  return (
    <div id="four-day">
      {/*
          ? -> render elements only 'forecastData' is not null
      */}
      {forecastData ? (
        forecastData.map((forecast, index) => (

          // Link to relevant page for that day when user selects
          <Link to={`/temp/${forecast.day}`}>

            {/*
              Display day name, temperature and icon for specific day
            */}
            <div id="four-day-item">
              <h3>{forecast.day}</h3>
              <p>{Math.round(forecast.temp.toFixed(2))}°C</p>
              <img src={getImage(forecast.description)} alt={forecast.description} />
            </div>
          </Link>
          
        ))
      ) : (
        // If no forecastData, render only this
        <p>Loading 4 day forecast data...</p>
      )}
      <div id="button-speech-day">
        {/*
            Text to speech button
        */}
        <ThemeProvider theme = {theme2}>
            { TTS && // render only if TTS is enabled
            <TextToSpeech id = 'tts' text={speech}/>
            }
			  </ThemeProvider>
      </div>
    </div>
  );
};

export default FourDayForecast;
