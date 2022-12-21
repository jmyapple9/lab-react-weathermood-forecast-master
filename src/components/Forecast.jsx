import React from 'react';
import ForecastDisplay from 'components/ForecastDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import {getForecast} from 'api/open-weather-map.js';
import {FORECASTDAYS} from '/config.jsx'

import './weather.css';

export default class Forecast extends React.Component {

    static getInitForecastState() {
        let F = [];
        for(let i=0;i<FORECASTDAYS-1;i++){
            const f = {
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
                id: i,
            };
            F.push(f);
        }
        // return F;
        return {
            city: 'na',
            forecastArr: F
            // code: -1,
            // group: 'na',
            // description: 'N/A',
            // temp: NaN,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Forecast.getInitForecastState(),
            loading: false,
            masking: false
        };

        // TODO
        this.handleFormQuery = this.handleFormQuery.bind(this);
    }
    componentDidMount() {
        this.getForecast('Hsinchu', 'metric');
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }
    render() {
        // console.log(this.state.forecastArr[0]);
        return (
            <div className={`forecast weather-bg ${this.state.forecastArr[0].group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQuery}/>
                    <ForecastDisplay {...this.state}/>
                </div>
            </div>
        );
    }

    getForecast(city, unit) {
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getForecast(city, unit).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                }, () => this.notifyUnitChange(unit));
                // console.log('weather', weather);
                // this.setState({
                //     ...Forecast.getInitForecastState(unit),
                //     unit: 'metric',
                //     loading: false
                // }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitForecastState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQuery(city, unit) {
        this.getForecast(city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }
}

