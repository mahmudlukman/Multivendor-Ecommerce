// import styles from '../../styles/styles';
// import EventCard from './EventCard';
// import { useGetEventsQuery} from '../../redux/features/event/eventApi';


// const Events = () => {
//   const { data: allEvents, isLoading } = useGetEventsQuery({});

//   return (
//     <div>
//       {!isLoading && (
//         <div className={`${styles.section}`}>
//           <div className={`${styles.heading}`}>
//             <h1>Popular Events</h1>
//           </div>

//           <div className="w-full grid">
//             {allEvents && allEvents.length > 0 && (
//               <EventCard active={true} data={allEvents[0]} />
//             )}
//             {(!allEvents || allEvents.length === 0) && <h4>No Events have!</h4>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Events;

import React, { useEffect } from 'react';
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

const Events: React.FC = () => {
  const { data: allEvents, isLoading, error } = useGetEventsQuery({});

  useEffect(() => {
    console.log('All Events:', allEvents);
    console.log('Type of allEvents:', typeof allEvents);
    console.log('Is Array:', Array.isArray(allEvents));
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);
  }, [allEvents, isLoading, error]);

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error loading events: {JSON.stringify(error)}</div>;
  }

  if (!allEvents) {
    return <div>No events data available.</div>;
  }

  // Handle case where allEvents is an object with a nested array
  const eventsArray = Array.isArray(allEvents) ? allEvents : allEvents.events || [];

  if (eventsArray.length === 0) {
    return <div>No events available.</div>;
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
        {eventsArray.map((event: Event) => (
          <EventCard key={event._id} active={true} data={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;