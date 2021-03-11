import client from './client';
import { API_KEY } from "shared/constants";
import { AxiosResponse } from 'axios';

export interface ResponseLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    // state?: string;
    // local_names: {
    //   en: string;
    //   feature_name: string,
    //   ascii: string,
    // }
}

export function getLocationByName(name: string): Promise<AxiosResponse<ResponseLocation[]>> {
  const prefix: string = "geo/1.0/direct";
  const params = {
    q: name,
    limit: 1,
    appid: API_KEY,
    lang: "en"
  };
  return client.get(prefix, { params });
}
