import { useEffect, useMemo, useState } from "react";
import CityAutocomplete from "../components/CityAutocomplete";
import ForecastList from "../components/ForecastList";
import WeatherInfoGrid from "../components/WeatherInfo";
import ToggleButton from "../components/ToggleButton";
import Loader from "../components/Loader";
import LiveClock from "../components/LiveClock";
import { weatherMap } from "../components/WeatherMap";
import { useWeather } from "../context/WeatherContext";
import "../styles/home.css";

const weatherCodeMap = new Map([
  [[0, 1], "bg-clear"],
  [[2, 3], "bg-cloudy"],
  [[45, 48], "bg-fog"],
  [[51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99], "bg-rainy"],
]);

const getBackgroundClass = (code) => {
  if (code === null || code === undefined) return "bg-default";

  for (const [codes, className] of weatherCodeMap.entries()) {
    if (codes.includes(code)) return className;
  }

  return "bg-default";
};

const aqiDescriptionMap = new Map([
  [20, "Ottima"],
  [40, "Buona"],
  [60, "Accettabile"],
  [80, "Scarsa"],
  [100, "Molto scarsa"],
]);

const getAqiDescription = (aqi) => {
  for (const [max, description] of aqiDescriptionMap.entries()) {
    if (aqi <= max) return description;
  }
  return "Estremamente scarsa";
};

const Home = () => {
  const {
    city,
    setCity,
    clearCity,
    weather,
    weatherCode,
    humidity,
    uvIndex,
    pm25,
    pm10,
    aqi,
    maxTemp,
    minTemp,
    forecast,
    loading,
  } = useWeather();

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const [initialCityLoaded, setInitialCityLoaded] = useState(false);

  useEffect(() => {
    if (city && !initialCityLoaded) {
      setCity(city);
      setInitialCityLoaded(true);
    }
  }, [city, setCity, initialCityLoaded]);

  useEffect(() => {
    const bgClass = getBackgroundClass(weatherCode);
    document.body.classList.forEach((cls) => {
      if (cls.startsWith("bg-")) document.body.classList.remove(cls);
    });
    document.body.classList.add(bgClass);
    return () => document.body.classList.remove(bgClass);
  }, [weatherCode]);

  const weatherData = useMemo(
    () => [
      { label: "Vento", value: `${weather?.windspeed ?? "-"} km/h` },
      { label: "Umidità", value: `${humidity ?? "-"}%` },
      { label: "Indice UV", value: uvIndex ?? "-" },
      { label: "PM 2.5", value: `${pm25 ?? "-"} µg/m³` },
      { label: "PM 10", value: `${pm10 ?? "-"} µg/m³` },
      {
        label: "Qualità aria",
        value: aqi !== null ? `${aqi} ${getAqiDescription(aqi)}` : "-",
      },
    ],
    [weather, humidity, uvIndex, pm25, pm10, aqi]
  );

  return (
    <div className="container rounded shadow p-4" style={{ maxWidth: 400 }}>
      <h1 className="text-center mb-4">🌤️ Meteo</h1>

      <CityAutocomplete
        onSelect={setCity}
        savedQuery={
          city
            ? `${city.properties.city || city.properties.name}, ${
                city.properties.state || ""
              }, ${city.properties.country || ""}`
            : ""
        }
        onClear={clearCity}
      />

      <div className="d-flex justify-content-center align-items-center">
        {loading && <Loader />}
      </div>

      {weather && !loading && (
        <div className="mt-4 text-center container">
          <div className="row gx-3 gy-3">
            <div className="col-12">
              <div className="glass-box p-4 text-start">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    {weatherCode !== null && (
                      <img
                        src={`https://openweathermap.org/img/wn/${
                          weatherMap[weatherCode]?.icon || "01d"
                        }@2x.png`}
                        alt={weatherMap[weatherCode]?.desc || "meteo"}
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                    <div>{weatherMap[weatherCode]?.desc || "N/D"}</div>
                  </div>
                  <div className="text-end">
                    <div className="fs-1 fw-bold">
                      {weather?.temperature ?? "-"}°
                    </div>
                    <div className="max-min">
                      {maxTemp ?? "-"}° / {minTemp ?? "-"}°
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <div className="fw-semibold">
                    {city?.properties.city || city?.properties.name}
                  </div>
                  <LiveClock />
                </div>

                <ForecastList forecast={forecast} />
              </div>
            </div>

            <ToggleButton isExpanded={isExpanded} toggle={toggleExpanded} />

            {isExpanded && <WeatherInfoGrid weatherData={weatherData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
