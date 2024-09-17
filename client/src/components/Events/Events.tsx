import { FC} from 'react';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { useGetEventsQuery } from '../../redux/features/event/eventApi';

interface Event {
  _id: string;
  name: string;
  description: string;
  images: { url: string }[];
  originalPrice: number;
  discountPrice: number;
  sold_out: number;
  stock: number;
  Finish_Date: string;
}

const Events: FC = () => {
  const { data: allEvents, isLoading, error } = useGetEventsQuery({});

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error loading events: {JSON.stringify(error)}</div>;
  }

  if (!allEvents) {
    return <div>No events data available.</div>;
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
        {allEvents.events.map((event: Event) => (
          <EventCard key={event._id} active={true} data={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;