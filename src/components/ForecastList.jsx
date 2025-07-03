import { weatherMap } from "../components/WeatherMap";

const ForecastList = ({ forecast }) => {
  const getShortDay = (date) => {
    const giorni = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    return giorni[date.getDay()];
  };

  return (
    <div className="forecast-row d-flex mt-3 px-1 gap-2">
      {forecast.map((day) => {
        const dateObj = new Date(day.date);
        const icon = weatherMap[day.code]?.icon || "01d";
        const label = getShortDay(dateObj);

        return (
          <div
            key={day.date}
            className="glass-box forecast-card px-2 py-1 text-center"
          >
            <div className="text-muted small">
              {dateObj.toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
            <div className="fw-bold">{label}</div>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt=""
              style={{ width: 40, height: 40 }}
            />
            <div className="small">
              <span className="temp-max">{Math.round(day.max)}°</span>
              <span>/</span>
              <span className="temp-min">{Math.round(day.min)}°</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForecastList;
