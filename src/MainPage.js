import FourDayForecast from './FourDayForecast';
import HourlyForecast from './HourlyForecast';
import TodayForecast from './TodayForecast';

export function MainPage() {
	return (
	/*
		Main display for the weather app

		Render main info for today with 'TodayForecast'

		Render weather forecast for next four days with 'FourDayForecast'

		Render forecast for next hours with 'HourlyForecast'
	*/
	<div id="main-page"> 
		<TodayForecast/>
		<div className = "temp">
			<FourDayForecast/>
		</div>
		<div className='hour'>
			<HourlyForecast/>
		</div>
	</div>
	)
}