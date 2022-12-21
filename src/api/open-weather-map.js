import axios from 'axios';
import {FORECASTDAYS} from '/config.jsx'

// TODO replace the key with yours
const key = '40157db88d240d8b1a441c43f2fec94a'; // My openweathermap key
const todayUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${key}`;

export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
    var url = `${todayUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            return {
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

export function getForecast(city, unit) {
    // TODO
    var url = `${forecastUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            // console('testing1!!!!!!!')
            throw new Error(res.data.message);
        } else {
            let F = [];
            for(let i=7;i<8*FORECASTDAYS;i+=8){
                // console.log('api getting data: ',res.data.list[i]);
                const f={
                    code: res.data.list[i].weather[0].id,
                    group: getWeatherGroup(res.data.list[i].weather[0].id),
                    description: res.data.list[i].weather[0].description,
                    temp: res.data.list[i].main.temp,
                    id: i,
                }
                F.push(f);
            }
            // console.log(F)
            
            return {
                city: capitalize(city),
                forecastArr: F,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
    }

export function cancelForecast() {
    // TODO
    weatherSource.cancel('Request canceled');
}
