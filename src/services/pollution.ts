import client from "./client";
import { API_KEY } from "shared/constants";
import { AxiosResponse } from "axios";

interface ResponseAirPollution {

}

export function getAirPollutionData(lat: number, lon: number): Promise<AxiosResponse<ResponseAirPollution>> {
  const prefix: string = "data/2.5/air_pollution";
  const params = {
    lat,
    lon,
    appid: API_KEY,
  };
  return client.get(prefix, { params });
}
