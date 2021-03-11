import client from "./client";
import { API_KEY } from "shared/constants";
import { AxiosResponse } from "axios";

interface ResponseWeather {

}

export function getWeatherData(lat: string, lon: string, exclude: string): Promise<AxiosResponse<ResponseWeather>> {
    const prefix: string = "data/2.5/onecall";
    const params = {
      lat,
      lon,
      exclude,
      appid: API_KEY
    };
    return client.get(prefix, { params });
  }
  