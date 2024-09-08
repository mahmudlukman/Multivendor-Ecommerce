import axios from "axios";
import { useEffect, useState, FC } from "react";
import { server } from "../../server";

interface Props {
  data: {
    _id: string;
    Finish_Date: string;
  };
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountDown: FC<Props> = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === 'undefined' &&
      typeof timeLeft.hours === 'undefined' &&
      typeof timeLeft.minutes === 'undefined' &&
      typeof timeLeft.seconds === 'undefined'
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`);
    }
    return () => clearTimeout(timer);
  });

  function calculateTimeLeft(): TimeLeft {
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