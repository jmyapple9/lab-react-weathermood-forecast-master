import React from 'react';
import PropTypes from 'prop-types';

import {FORECASTDAYS, DAYS} from '/config.jsx'
import './ForecastDisplay.css';

export default class ForecastDisplay extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        unit: PropTypes.string,
        forecastArr: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.number,
            group: PropTypes.string,
            temp: PropTypes.number,
            id: PropTypes.number,
          })),
        // group: PropTypes.string,
        // description: PropTypes.string,
        // temp: PropTypes.number,
        // city: 'na',
        // code: -1,
        // group: 'na',
        // temp: NaN,
        // list: F
    };

    constructor(props) {
        super(props);

    }

    render() {
        let u = this.props.unit;
        // let timeElapsed = Date.now();
        // let today = new Date(timeElapsed);
        // let Day = today.toDateString().substring(0,3);

        const d = new Date();
        let Day = d.getDay();
        let IconList = this.props.forecastArr.map(function(day){
            return <span key = {day.id} className='forecastIcon'>{DAYS[(++Day)%7]}: {day.temp.toFixed(0)}&ordm;{(u === 'metric')
            ? 'C'
            : 'F'}
                <i className={`owf owf-${day.code} owf-2x`}></i>
            </span>
        });
        IconList.shift(); //remove "tomorrow's" temp
        
        return (
            <div>
                <div className={`forecast-display ${this.props.masking
                    ? 'masking'
                    : ''}`}>
                    <img src={`images/w-${this.props.forecastArr[0].group}.png`}/>
                    <p className='description'>Tomorrow: {this.props.forecastArr[0].description}</p>&nbsp;
                    <h1 className='temp'>
                        <span className='display-3'>{this.props.forecastArr[0].temp.toFixed(0)}&ordm;</span>
                        &nbsp;{(this.props.unit === 'metric')
                            ? 'C'
                            : 'F'}
                    </h1>
                </div>

                <div className='IconRow'>
                    {IconList}
                    {/* <span className='forecastIcon'>Sat: 1&ordm;C
                        <i className="owf owf-803 owf-2x"></i>
                    </span>
                    <span className='forecastIcon'>Sat: 2&ordm;C
                        <i className="owf owf-803 owf-2x"></i>
                    </span>
                    <span className='forecastIcon'>Sat: 3&ordm;C
                        <i className="owf owf-803 owf-2x"></i>
                    </span>
                    <span className='forecastIcon'>Sat: 4&ordm;C
                        <i className="owf owf-803 owf-2x"></i>
                    </span> */}
                    
                </div>
            </div>
        );
    }
}
