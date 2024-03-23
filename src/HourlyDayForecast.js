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
import { useParams } from 'react-router-dom';

const HourlyDayForecast = () => {
    //const [city, setCity] = useState('London');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);

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

    //Variable contains the params
    const { data } = useParams();

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

            const forecastResponse = await axios.get(// API call
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=37ad51421f1c727465cc1c5737df506b`
              );
            //console.log("Forecast data response:", forecastResponse.data);
        
            setWeatherData(forecastResponse.data);
    
            //gets the hourly information for the next five days in 3 hour time slots
            const hourlyForecasts = forecastResponse.data.list.slice(0, 35).map(forecast => ({
                day: new Date(forecast.dt * 1000).getDay(),
                hour: new Date(forecast.dt * 1000).getHours(),
                temp: Math.round(forecast.main.temp),
                description: forecast.weather[0].main,
            }));

     
            //dictionary each day to a number 0-6
            const daysToNumber ={
              'Monday':1,
              'Tuesday':2,
              'Wednesday':3,
              'Thursday':4,
              'Friday':5,
              'Saturday':6,
              'Sunday':0,
            };

            //index which starts at 0 to go through all the hourly forecasts
            var index =0;

            //checks if the user has picked today because that will be the correct information starting at index 0
            if (data!="Today"){
              //while loop goes through to find the start of the day the user has chosen
              while (index<35){
                if(hourlyForecasts[index].day===daysToNumber[data]) {            
                  //breaks loop
                  break;
                }else{
                  //else increases by 1
                  index+=1;
                };         
              };

            }
            //gets the correct slice of the array
            const hourlyDayForecast = hourlyForecasts.slice(index,index+7);
            //sets the variable
            setHourlyForecast(hourlyDayForecast)

            // text to speech
            setSpeech(hourlyForecast && (hourlyForecast.map((forecast, index) => ("The temperature is "+Math.round(forecast.temp.toFixed(2))+" degrees at "+forecast.hour+" o'clock ,"))));
            
    
        } catch (error) {
          console.error(error);
        }
    });
    
    useEffect(() => {
        fetchData();
        console.log("Effect triggered with latitude:", latitude, "longitude:", longitude);
    }, [longitude, latitude]);
    
    
      const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
      };

    //outputs the correct information using a map
    return (
        <div>
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

    )};

export default HourlyDayForecast;