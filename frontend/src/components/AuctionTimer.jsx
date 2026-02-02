import { ClockFading } from "lucide-react";
import { useEffect, useState } from "react";

const AuctionTimer = ({ endDate, hideIfEnded = false, page }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);

    return {
      days: Math.floor(totalSeconds / (24 * 3600)),
      hours: Math.floor((totalSeconds % (24 * 3600)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const timeRemaining = getTimeRemaining();

  if (hideIfEnded && timeRemaining === null && page === "explore") {
    return null;
  }

  return (
    <div className="absolute top-3 right-3 group/ends">
      <div className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded-full bg-black/70 backdrop-blur overflow-hidden max-w-[80px] group-hover/ends:max-w-[260px] transition-all duration-300 ease-out origin-right">
        {timeRemaining ? (
          <>
            <ClockFading size={14} className="shrink-0 opacity-80" />
            <span className="whitespace-nowrap">
              {timeRemaining.days}d {timeRemaining.hours}h
            </span>
            <span className="whitespace-nowrap opacity-0 group-hover/ends:opacity-100 transition-opacity duration-200 delay-100">
              {timeRemaining.minutes}m {timeRemaining.seconds}s
            </span>
          </>
        ) : (
          <span className="whitespace-nowrap text-red-400">Ended</span>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
