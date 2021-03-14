import { Button, Card, Input } from "antd";
import { AxiosResponse } from "axios";
import { FC, useCallback, useState } from "react";
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
import IMG_NOT_FOUND from "./not_found_location.png";
import "./Weather.scss";

enum unitType {
  F = "imperial",
  C = "metric",
}

enum DataType {
  UnitWindSpeed = "UnitWindSpeed",
  DataWindSpeed = "DataWindSpeed",
  UnitTemp = "UnitTemp",
  DataTemp = "DataTemp",
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
  const [title, setTitle] = useState<string>();
  const [indexSelected, setIndexSelected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [units, setUnits] = useState<unitType>(unitType.C);
  const [currentData, setCurrent] = useState<WeatherCurrent>();
  const [selected, setSelected] = useState<WeatherDay | WeatherCurrent>();
  const [dailyData, setDaily] = useState<WeatherDay[]>();

  const resetData = () => {
    setTitle(undefined);
    setDaily(undefined);
    setSelected(undefined);
    setCurrent(undefined);
  };
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
        resetData();
      }
    } catch (error) {
      console.log(error.toString());
      resetData();
    } finally {
      setLoading(false);
    }
  };
  const getWeatherDataByLocation = useCallback(
    async (latt: number, long: number) => {
      try {
        setLoading(true);
        const resultWeather: AxiosResponse<ResponseWeather> = await getWeatherData(
          latt,
          long,
          unitType.C
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
        resetData();
      } finally {
        setLoading(false);
      }
    },
    []
  );
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
  const changeUnitType = (type: unitType) => {
    setUnits(type);
  };
  const clickDailyCard = (dailyData: WeatherDay, index: number) => {
    setIndexSelected(index);
    if (index === 0) {
      setSelected(currentData);
    } else {
      setSelected(dailyData);
    }
  };
  const convertToF = (degreeC: number): number =>
    Math.round((degreeC * 9) / 5 + 32);
  const convertDataByUnit = useCallback(
    (datatype: DataType, dataValue?: number | string) => {
      switch (datatype) {
        case DataType.UnitWindSpeed:
          if (units === unitType.C) {
            return "KPH";
          } else {
            return "MPH";
          }
        case DataType.DataWindSpeed:
          if (units === unitType.C) {
            return Number(dataValue);
          } else {
            return (Number(dataValue) * 0.62).toFixed(2);
          }
        case DataType.DataTemp:
          if (units === unitType.C) {
            return Math.round(Number(dataValue));
          } else {
            return convertToF(Number(dataValue));
          }
        default:
          break;
      }
    },
    [units]
  );

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
          <div className="weather--result--info w-100">
            <h2>{title}</h2>
            <span className="d__block">
              {moment.unix(selected.dt).format("dddd HA") +
                " - " +
                selected.weather[0].main}
            </span>
            <div className="d__flex">
              <div className="w__50 d__flex">
                <img
                  className=""
                  src={getIcon(selected.weather[0].icon)}
                  alt=""
                />
                <div className="info--temp--value">
                  {typeof selected.temp === "number"
                    ? convertDataByUnit(DataType.DataTemp, selected.temp)
                    : convertDataByUnit(
                        DataType.DataTemp,
                        selected.temp.max
                      )}{" "}
                  &#176;
                </div>
                <div className={`info--temp--unit`}>
                  <Button
                    type="link"
                    onClick={() => changeUnitType(unitType.F)}
                    className={`${
                      units === unitType.F ? "info--temp--unit__selected" : ""
                    }`}
                  >
                    F
                  </Button>{" "}
                  /{" "}
                  <Button
                    type="link"
                    onClick={() => changeUnitType(unitType.C)}
                    className={`${
                      units === unitType.C ? "info--temp--unit__selected" : ""
                    }`}
                  >
                    C
                  </Button>
                </div>
              </div>
              <div className="w__50">
                <span>Humidity: {selected.humidity} &#37;</span>
                <br />
                <span>
                  Wind:{" "}
                  {convertDataByUnit(
                    DataType.DataWindSpeed,
                    selected.wind_speed
                  )}{" "}
                  {convertDataByUnit(DataType.UnitWindSpeed)}
                </span>
                <br />
                {selected.air ? (
                  <span>Air Quality: {getAirQuality(selected.air)}</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="weather--result--list w-100 d__flex">
            {dailyData.map((item, index) => (
              <Card.Grid
                key={item.dt}
                className={`weather--result--item ${
                  index === indexSelected
                    ? "weather--result--item__selected"
                    : ""
                }`}
              >
                <Button type="link" onClick={() => clickDailyCard(item, index)}>
                  <h4>{moment.unix(item.dt).format("ddd")}</h4>
                  <img src={getIcon(item.weather[0].icon)} alt="" />
                  <div className="item--temp__max">
                    {convertDataByUnit(DataType.DataTemp, item.temp.max)} &#176;
                  </div>
                  <div className="item--temp__min">
                    {convertDataByUnit(DataType.DataTemp, item.temp.min)} &#176;
                  </div>
                </Button>
              </Card.Grid>
            ))}
          </div>
        </div>
      ) : (
        <div className="weather--result weather--result__none">
          <img src={IMG_NOT_FOUND} alt="" />
          <div>
            We could not find weather information for the location above
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
