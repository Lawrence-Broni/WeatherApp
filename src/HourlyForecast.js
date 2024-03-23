import './App.css';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import Sun from './Assets/sun.png';
import Rain from './Assets/rain.png';
import Drizzle from './Assets/drizzle.png';
import Snow from './Assets/snow.png';
import Storm from './Assets/storm.png';
import Atmosphere from './Assets/atmosphere.png';
import Cloud from './Assets/cloud.png';
import { LocationContext, TTSContext } from './App';
import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import TextToSpeech from './TextToSpeech';

const HourlyForecast = () => {

    // Variable to hold returned data from API call
    const [hourlyForecast, setHourlyForecast] = useState(null);
    
    // Initialise location variables from location context
    const {longitude, setLongitude} = useContext(LocationContext);
    const {latitude, setLatitude} = useContext(LocationContext);

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
          //console.log("Fetching weather data for", city);

            const forecastResponse = await axios.get( // API call
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=37ad51421f1c727465cc1c5737df506b`
              );
            //console.log("Forecast data response:", forecastResponse.data);
        
            // Process API call to extract the data we need
            const hourlyForecasts = forecastResponse.data.list.slice(0, 7).map(forecast => ({
                hour: new Date(forecast.dt * 1000).getHours(),
                temp: Math.round(forecast.main.temp),
                description: forecast.weather[0].main,
            }));
              

          setHourlyForecast(hourlyForecasts); // Set hourly forecast data
          //console.log(hourlyForecasts)


          // Set TTS speech text
          setSpeech(hourlyForecast && (hourlyForecast.map((forecast, index) => ("The temperature is "+Math.round(forecast.temp.toFixed(2))+" degrees at "+forecast.hour+" o'clock ,"))));
    
        } catch (error) {
          console.error(error);
        }
    });
    
    useEffect(() => { // Fetch data when page loads or when long or lat changes
        fetchData();
        //console.log("Effect triggered with latitude:", latitude, "longitude:", longitude);
    }, [longitude, latitude]);

    return (
        <div>
        {/*
          ? -> render elements only 'forecastData' is not null
        */}
        {hourlyForecast && (
            <div className = 'hour'>
              {hourlyForecast.map((forecast, index) => (
                  // Display temperature and icon for given hour
                  <div className='hourDiv'>
                      <div id = "hour-item" key={index}>
                          <p>{Math.round(forecast.temp.toFixed(2))}°C</p>
                          <img src={getImage(forecast.description)} alt={forecast.description}/>
                          <p>{forecast.hour}:00</p> 
                      </div>
                  </div>
              ))}
            </div>
        )}
        {/*
            Text to speech button
        */}
        <ThemeProvider theme = {theme2}>
          {TTS && // render only if TTS is set
				  <TextToSpeech id = 'tts' text={speech}/>
          }
			  </ThemeProvider>
        </div>
    );
};

export default HourlyForecast;