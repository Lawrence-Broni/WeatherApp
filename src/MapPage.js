import React, { useEffect, useRef, useContext, useState } from 'react';
import 'ol/ol.css';
import './App.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import markerImage from './Assets/black_location_marker.png';
import StadiaMaps from 'ol/source/StadiaMaps';
import TextToSpeech from './TextToSpeech';
import { ThemeProvider } from '@mui/material';
import theme2 from './OtherTheme';
import { LocationContext, TTSContext } from './App';

const MapPage = () => {
    const mapRef = useRef();
    const mapInstance = useRef(null);
    // Using useContext to get the longitude and latitude from the LocationContext
    const { longitude, latitude } = useContext(LocationContext);
    // Temperature boundary for deciding between leisure centres and parks
    const tempBoundary = 15;
    // Variable to hold API key
    const apiKey = '7c1355aa38da1917d09a77f407d41409';

    // State for storing the current temperature
    const [currentTemperature, setCurrentTemperature] = useState(null);
    // Function to fetch the current temperature based on latitude and longitude
    const fetchTemperature = async (latitude, longitude) => {// Make API call
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        return data.main.temp;
    };
    // Initialise TTS state variable from TTS context
    const { TTS, setTTS } = useContext(TTSContext);
    // Initialise variable to hold the TTS speech text
    const [speech, setSpeech] = useState('Speech not yet set');

    // Array of leisure centres and their coordinates
    const leisureCentres = [
        { name: "Mile End Leisure Centre", coordinates: [-0.03216, 51.51920] },
        { name: "Kensington Leisure Centre", coordinates: [-0.21389, 51.51367] },
        { name: "Swiss Cottage Leisure Centre", coordinates: [-0.17272, 51.54224] },
        { name: "York Hall Leisure Centre", coordinates: [-0.05527, 51.52970] },
        { name: "Oasis Leisure Centre", coordinates: [-0.12566, 51.51577] },
        { name: "Southgate Leisure Centre", coordinates: [-0.12438, 51.63429] },
        { name: "Streatham Leisure Centre", coordinates: [-0.13108, 51.42377] }
    ];

    // Array of parks and their coordinates
    const parks = [
        { name: "Regent's Park", coordinates: [-0.15436, 51.52984] },
        { name: "The Green Park", coordinates: [-0.14385, 51.50390] },
        { name: "Victoria Park", coordinates: [-0.03670, 51.53734] },
        { name: "Greenwich Park", coordinates: [-0.00146, 51.47691] },
        { name: "West Ham Park", coordinates: [0.01798, 51.53947] },
        { name: "Crystal Palace Park", coordinates: [-0.07094, 51.42210] },
        { name: "Priory Park", coordinates: [-0.12277, 51.58591] }
    ];

    // useEffect hook to fetch the current temperature and set up the map
    useEffect(() => {
        const fetchcurrentTemperature = async () => {
            if (longitude && latitude) {
                const temp = await fetchTemperature(latitude, longitude);
                setCurrentTemperature(temp);

                // Creating the icon style for the location markers
                const iconStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: markerImage,
                        scale: 1,
                    })
                });

                // Deciding between leisure centres and parks based on the current temperature
                const locations = temp <= tempBoundary ? leisureCentres : parks;
                // Creating the and setting speech text
                const locationNames = locations.map(({ name }) => name).join(', ');
                const speechText = `Recommended Locations: ${locationNames}`;
                setSpeech(speechText);

                const features = locations.map(location => {
                    // Create a new feature for each location
                    const feature = new Feature({
                        // Geometry of the feature is point which is used to represent a single location
                        geometry: new Point(fromLonLat(location.coordinates))
                    });
                    feature.setStyle(iconStyle);
                    return feature;
                });

                // Creating a vector layer with the features (location markers)
                const vectorLayer = new VectorLayer({
                    source: new VectorSource({
                        features: features
                    })
                });

                // If the map instance doesn't exist create a new map
                if (!mapInstance.current) {
                    mapInstance.current = new Map({
                        target: mapRef.current,
                        layers: [
                            new TileLayer({
                                source: new StadiaMaps({
                                    layer: 'osm_bright',
                                    retina: true,
                                })
                            }),
                            vectorLayer
                        ],

                        view: new View({
                            center: fromLonLat([longitude, latitude]),
                            zoom: 12
                        })
                    });
                } else {
                    // If the map instance already exists update the view of the map
                    mapInstance.current.getView().setCenter(fromLonLat([longitude, latitude]));
                }
            }
        };
        fetchcurrentTemperature();
    }, [longitude, latitude]); // useEffect hook runs whenever longitude or latitude changes so temperature and map is updated

    return (
        <div id="map-page">
            <div id="locations-text">
                <p>Recommended Locations</p>
                {currentTemperature <= tempBoundary ? (// Displays either leisure centres or parks based on the current temperature
                    <ul>
                        {leisureCentres.map((location) => (
                            // When a location name is clicked the map is centered on that location
                            <li key={location.name} onClick={() => {
                                mapInstance.current.getView().setCenter(fromLonLat(location.coordinates));
                            }}>
                                {location.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul>
                        {parks.map((location) => (
                            // When a location name is clicked the map is centered on that location
                            <li key={location.name} onClick={() => {
                                mapInstance.current.getView().setCenter(fromLonLat(location.coordinates));
                            }}>
                                {location.name}
                            </li>
                        ))}
                    </ul>
                )}
                <div id="button-speech-map">
                    <ThemeProvider theme={theme2}>
                        {TTS &&
                            <TextToSpeech id='tts' text={speech} />
                        }
                    </ThemeProvider>
                </div>
                
            </div>
            <div ref={mapRef} className="map-container" />
        </div>
    );
}

export default MapPage;
