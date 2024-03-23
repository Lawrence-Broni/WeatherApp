import React, { useEffect, useState, createContext } from 'react';
import { MainPage } from './MainPage';
import { TopMenu } from './TopMenu';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import TempPage from './TempPage';
import MapPage from './MapPage';
import SettingsPage from './SettingsPage';
import TempInfo from './TempForecast';

import {
	setKey,
	setDefaults,
	setLanguage,
	setRegion,
	fromAddress,
	fromLatLng,
	fromPlaceId,
	setLocationType,
	geocode,
	RequestType,
} from "react-geocode";

setDefaults({
	key: "AIzaSyDbWgu_L8Xw6Q-gnZI7X_V7yC1vbNPEP6E", // API key
	language: "en", // English
	region: "uk", // UK
});

export const LocationContext = createContext(); // Provide global context for location information, coordinates and location name
export const FontContext = createContext(); // Provide global context for font information, css font sizes
export const TTSContext = createContext(); // Provide global context for TTS information, whether it is enabled or not

const App = () => {
	const [latitude, setLatitude] = useState(51.52); // Set default latitude
	const [longitude, setLongitude] = useState(-0.04); // Set default longitude
	const [location, setLocation] = useState('Stepney Green'); // Set default location

	const [h1FontSize, setH1FontSize] = useState(2); // Set default <h1> tag size
	const [h2FontSize, setH2FontSize] = useState(1.9); // Set default <h2> tag size
	const [pFontSize, setPFontSize] = useState(1.7); // Set default <p> tag size

	const [TTS, setTTS] = useState(true); // Set whether TTS is enabled, default is on

	// Get users current coordinates
	const getUserLocation = () => {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition( // Ask user to allow location services tracking
			(position) => {
				const { latitude: receivedLatitude, longitude: receivedLongitude } = position.coords; // Saves returned coordinates to variable		  
				setLatitude(receivedLatitude);
			 	setLongitude(receivedLongitude);
				fromLatLng(receivedLatitude, receivedLongitude) // Convert coords to named location
				.then(({ results }) => {
				   setLocation(results[0].address_components[2].short_name);
				   //console.log(location);
				})
				.catch(console.error);
			},
			(error) => {
			  console.error('Error getting user location:', error);
			}
		  );
		}
		else {
		  console.error('Geolocation is not supported by this browser.');
		}
	};

	useEffect(() => { // When page loaded, call function to request location
		getUserLocation(); 
	}, []);

	return (

	<Router>
		{/*
			Setup context provider variables
			Here these variables are made globally available
		*/}
		<TTSContext.Provider value = {{TTS: TTS, setTTS: setTTS}}>
		<FontContext.Provider value={{h1FontSize: h1FontSize, setH1FontSize: setH1FontSize, 
									h2FontSize: h2FontSize, setH2FontSize: setH2FontSize, 
									pFontSize: pFontSize, setPFontSize: setPFontSize}}>
		<LocationContext.Provider value={{latitude: latitude, setLatitude: setLatitude, 
										longitude: longitude, setLongitude: setLongitude, 
										location: location, setLocation: setLocation}}>
			{/*
				Set global font sizing
			*/}
			<div style={{ 
				"--h1-font-size": `${h1FontSize}em`,
				"--h2-font-size": `${h2FontSize}em`,
				"--p-font-size": `${pFontSize}em`,
			}}>
			
			
			{/*
				Setup top title
				Dropdown menu
			*/}
			<div className = "top-bar">
				<TopMenu />
				<h1 className = "top-title">Weather Forecast App</h1>
			</div>
			<Switch>
				{/*
					Use exact path to go to Main page
					Otherwise it would always direct to main page
				*/}		
				<Route exact path="/" component={MainPage}>
					<MainPage/>
				</Route>

				{/*
					Setup routing to other pages

					/temp/:data -> link to temperature data for specific day (based on whats passed in 'data')

					/map -> go to the map page

					/settings ->  o to  the settings page
				*/}
				<Route path="/temp/:data" component={TempInfo}>
					<TempPage/>
				</Route>
				<Route path="/map">
					<MapPage/>
				</Route>
				<Route path="/settings">
					<SettingsPage/>
				</Route>
			</Switch>
			</div>
		</LocationContext.Provider>
		</FontContext.Provider>
		</TTSContext.Provider>
	</Router>
	);
};
    
export default App;
