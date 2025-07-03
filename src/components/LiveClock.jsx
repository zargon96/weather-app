import { useEffect, useState } from "react";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-end">
      <div className="fw-bold">
        {now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      <div className="small text-uppercase">
        {now.toLocaleDateString("it-IT", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        })}
      </div>
    </div>
  );
};

export default LiveClock;
