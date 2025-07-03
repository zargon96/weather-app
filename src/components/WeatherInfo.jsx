const WeatherInfoGrid = ({ weatherData }) => (
  <>
    {weatherData.map(({ label, value }) => (
      <div key={label} className="col-6 fade-in">
        <div className="glass-box h-100 text-start p-2">
          <strong>{label}:</strong>
          <br />
          {value}
        </div>
      </div>
    ))}
  </>
);

export default WeatherInfoGrid;
