import { FC, useEffect, useState } from "react";
import { EventData } from "../../types";

interface Props {
  data: EventData;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountDown: FC<Props> = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    if (!data.Finish_Date || isNaN(new Date(data.Finish_Date).getTime())) {
      console.warn(`Invalid Finish_Date for event ${data._id}:`, data.Finish_Date);
      return {};
    }

    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [data._id, data.Finish_Date]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof TimeLeft]) {
      return null;
    }

    return (
      <span key={interval} className="text-[25px] text-[#475ad2]">
        {timeLeft[interval as keyof TimeLeft]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;