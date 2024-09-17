import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { useGetEventsQuery } from '../redux/features/event/eventApi';

const EventsPage = () => {
  const { data: allEvents, isLoading } = useGetEventsQuery({});
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents.events && allEvents.events[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;
