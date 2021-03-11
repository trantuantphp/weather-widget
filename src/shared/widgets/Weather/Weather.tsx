import { Button, Input } from "antd";
import { AxiosResponse } from "axios";
import { FC, useState } from "react";
import moment from "moment";
import { getLocationByName, ResponseLocation } from "services/location";
import {
  getWeatherData,
  ResponseWeather,
  WeatherDay,
  WeatherCurrent,
} from "services/weather";
import { getAirPollutionData, ResponseAirPollution } from "services/pollution";
import { getIcon } from "services/icon";
import Loading from "shared/components/Loading";
import "./Weather.scss";

enum unitType {
  F = "imperial",
  C = "metric",
}

const getAirQuality = (aqi: number): string => {
  let result: string = "";
  switch (aqi) {
    case 1:
      result = "Good";
      break;
    case 2:
      result = "Fair";
      break;
    case 3:
      result = "Moderate";
      break;
    case 4:
      result = "Poor";
      break;
    case 5:
      result = "Very Poor";
      break;
    default:
      break;
  }
  return result;
};

const Weather: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<unitType>(unitType.C);
  const [currentData, setCurrent] = useState<WeatherCurrent>();
  const [selected, setSelected] = useState<WeatherDay | WeatherCurrent>();
  const [dailyData, setDaily] = useState<WeatherDay[]>();
  const searchLocationByName = async (text: string) => {
    try {
      setLoading(true);
      const resultLocation: AxiosResponse<
        ResponseLocation[]
      > = await getLocationByName(text);
      if (resultLocation && resultLocation.data[0]) {
        const { lat, lon, country, name } = resultLocation.data[0];
        setTitle(name + ", " + country);
        getWeatherDataByLocation(lat, lon);
      } else {
      }
    } catch (error) {
      console.log(error.toString());
    } finally {
      setLoading(false);
    }
  };
  const getWeatherDataByLocation = async (latt: number, long: number) => {
    try {
      const resultWeather: AxiosResponse<ResponseWeather> = await getWeatherData(
        latt,
        long,
        units
      );
      const { current, daily, lat, lon } = resultWeather.data;
      const air: number | undefined = await getAirPollutionCurrent(
        lat,
        lon,
        current.dt
      );
      const currentAir = air ? Object.assign({}, current, { air }) : current;
      setCurrent(currentAir);
      setSelected(currentAir);
      setDaily(daily);
    } catch (error) {
      console.log(error.toString());
    }
  };
  const getAirPollutionCurrent = async (
    lat: number,
    lon: number,
    start: number
  ): Promise<number | undefined> => {
    try {
      const end: number = moment().endOf("day").unix();
      const resultAirPollution: AxiosResponse<ResponseAirPollution> = await getAirPollutionData(
        lat,
        lon,
        start,
        end
      );
      if (resultAirPollution && resultAirPollution.data.list) {
        return resultAirPollution.data.list[0].main.aqi;
      }
    } catch (error) {
      console.log(error.toString());
    }
  };
  return (
    <div className="weather">
      <Input
        className="weather--input"
        allowClear
        placeholder="City name ..."
        onPressEnter={(e) =>
          searchLocationByName((e.target as HTMLInputElement).value)
        }
      />
      {loading ? (
        <Loading />
      ) : dailyData && selected ? (
        <div className="weather--result">
          <div className="weather--result--info">
            <h2>{title}</h2>
            <small>
              {moment.unix(selected.dt).format("dddd HA") +
                " - " +
                selected.weather[0].main}
            </small>
            <div className="d__flex">
              <div>
                <img src={getIcon(selected.weather[0].icon)} alt="" />
                <div>
                  {typeof selected.temp === "number"
                    ? selected.temp
                    : selected.temp.max}{" "}
                  &#176;
                </div>
                <div>
                  <Button type="link">F</Button> /{" "}
                  <Button type="link">C</Button>
                </div>
              </div>
              <div>
                <span>Humidity: {selected.humidity} &#37;</span>
                <br />
                <span>Wind: {selected.wind_speed}</span>
                <br />
                {selected.air ? (
                  <span>Air Quality: {getAirQuality(selected.air)}</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="weather--result--list d__flex">
            {dailyData.map((item) => (
              <div>
                <h4>{moment.unix(item.dt).format("ddd")}</h4>
                <img src={getIcon(item.weather[0].icon)} alt="" />
                <div>{Math.round(item.temp.max)} &#176;</div>
                <div>{Math.round(item.temp.min)} &#176;</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
