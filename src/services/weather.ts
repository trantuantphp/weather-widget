import client from "./client";
import { API_KEY } from "shared/constants";
import { AxiosResponse } from "axios";

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Temp {
  min: number;
  max: number;
}

export interface WeatherCurrent {
  dt: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
  air?: number;
}
export interface WeatherDay {
  dt: number;
  temp: Temp;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
  air?: number;
}

export interface ResponseWeather {
  timezone_offset: number;
  lat: number;
  lon: number;
  current: WeatherCurrent;
  daily: WeatherDay[];
}

export function getWeatherData(
  lat: number,
  lon: number,
  units: string,
  exclude: string = "alerts,minutely,hourly"
): Promise<AxiosResponse<ResponseWeather>> {
  const prefix: string = "data/2.5/onecall";
  const params = {
    lat,
    lon,
    exclude,
    units,
    appid: API_KEY,
    lang: "en",
  };
  return client.get(prefix, { params });
}
