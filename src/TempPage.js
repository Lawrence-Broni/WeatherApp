import React, { useEffect, useState, useCallback, useContext, createContext } from 'react';
import HourlyDayForecast from './HourlyDayForecast';
import DayForecast from './DayForecast';

import TempForecast from './TempForecast';

const TempPage= () => {
    
	return (
        /*
            Same as main page except for,
            4 day forecast now replaced by detailed info for user selected day
        */
        <div id="temp-page">
                <DayForecast/>
                <TempForecast/>
                <div className='hour'>
                    <HourlyDayForecast/>
                </div>
	    </div>
	);
}


export default TempPage;