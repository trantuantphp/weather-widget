import client from './client';
import { API_KEY } from "shared/constants";
import { AxiosResponse } from 'axios';

interface ResponseLocation {
    name: string;
    lat: number;
    long: number;
    country: string;
    state?: string;
    local_names: any
}

export function getLocationByName(name: string): Promise<AxiosResponse<ResponseLocation[]>> {
  const prefix: string = "geo/1.0/direct";
  const params = {
    q: name,
    limit: 1,
    appid: API_KEY,
  };
  return client.get(prefix, { params });
}
