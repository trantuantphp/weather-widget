import client from "./client";
import { API_KEY } from "shared/constants";
import { AxiosResponse } from "axios";

export interface ResponseAirPollution {
  list: [
    {
      main: {
        aqi: number;
      };
    }
  ];
}

export function getAirPollutionData(
  lat: number,
  lon: number,
  start?: number,
  end?: number
): Promise<AxiosResponse<ResponseAirPollution>> {
  const prefix: string = "data/2.5/air_pollution";
  const params = {
    lat,
    lon,
    start,
    end,
    appid: API_KEY,
  };
  return client.get(prefix, { params });
}
