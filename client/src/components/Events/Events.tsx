import { FC } from 'react';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { useGetEventsQuery } from '../../redux/features/event/eventApi';
import { EventData, ServerError } from '../../types';
import { toast } from 'react-hot-toast';

const Events: FC = () => {
  const { data: allEvents, isLoading, error } = useGetEventsQuery({});

  if (isLoading) {
    return <div className={`${styles.section} text-center`}>Loading events...</div>;
  }

  if (error) {
    const serverError = error as ServerError;
    const errorMessage = serverError.data?.message || serverError.message || 'Error loading events';
    toast.error(errorMessage);
    return <div className={`${styles.section} text-center`}>{errorMessage}</div>;
  }

  if (!allEvents || !allEvents.events || allEvents.events.length === 0) {
    return <div className={`${styles.section} text-center`}>No events available.</div>;
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
        {allEvents.events.map((event: EventData) => (
          <EventCard key={event._id} active={true} data={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;