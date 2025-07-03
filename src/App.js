import Home from "./page/Home";
import { WeatherProvider } from "./context/WeatherContext";

function App() {
  return (
    <WeatherProvider>
      <div className="app-container">
        <Home />
      </div>
    </WeatherProvider>
  );
}

export default App;
