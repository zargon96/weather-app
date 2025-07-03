import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState(() =>
    JSON.parse(localStorage.getItem("selectedCity"))
  );
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherCode, setWeatherCode] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [pm25, setPm25] = useState(null);
  const [pm10, setPm10] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = useCallback(async (cityData) => {
    const { lat, lon } = cityData.geometry;
    const latitude = lat || cityData.geometry.coordinates[1];
    const longitude = lon || cityData.geometry.coordinates[0];
    localStorage.setItem("selectedCity", JSON.stringify(cityData));
    setCity(cityData);
    setLoading(true);

    try {
      const resWeather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,uv_index&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
      );
      const dataWeather = await resWeather.json();

      setWeather(dataWeather.current_weather);
      setWeatherCode(dataWeather.current_weather.weathercode);
      setMaxTemp(dataWeather.daily.temperature_2m_max[0]);
      setMinTemp(dataWeather.daily.temperature_2m_min[0]);

      const nextDays = dataWeather.daily.time.slice(1, 5).map((date, i) => ({
        date,
        code: dataWeather.daily.weathercode[i + 1],
        max: dataWeather.daily.temperature_2m_max[i + 1],
        min: dataWeather.daily.temperature_2m_min[i + 1],
      }));
      setForecast(nextDays);

      const now = new Date();
      const currentHour = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
        now.getHours()
      ).padStart(2, "0")}:00`;

      const idx = dataWeather.hourly.time.indexOf(currentHour);
      setHumidity(
        idx !== -1 ? dataWeather.hourly.relative_humidity_2m[idx] : null
      );
      setUvIndex(idx !== -1 ? dataWeather.hourly.uv_index[idx] : null);

      const resAir = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5,pm10,european_aqi&timezone=auto`
      );
      const dataAir = await resAir.json();
      const aIdx = dataAir.hourly.time.indexOf(currentHour);
      setPm25(aIdx !== -1 ? dataAir.hourly.pm2_5[aIdx] : null);
      setPm10(aIdx !== -1 ? dataAir.hourly.pm10[aIdx] : null);
      setAqi(aIdx !== -1 ? dataAir.hourly.european_aqi[aIdx] : null);
    } catch (err) {
      console.error("Errore fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCity = useCallback(() => {
    setCity(null);
    setWeather(null);
    setWeatherCode(null);
    setHumidity(null);
    setUvIndex(null);
    setPm25(null);
    setPm10(null);
    setAqi(null);
    setMaxTemp(null);
    setMinTemp(null);
    setForecast([]);
    localStorage.removeItem("selectedCity");
  }, []);

  useEffect(() => {
    if (city) fetchWeatherData(city);
  }, [city, fetchWeatherData]);

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity: fetchWeatherData,
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
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
