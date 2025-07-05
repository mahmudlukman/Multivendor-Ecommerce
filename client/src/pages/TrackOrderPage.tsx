import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header';
import TrackOrder from "../components/Profile/TrackOrder";

const TrackOrderPage = () => {
  return (
    <div>
        <Header activeHeading={0} />
        <TrackOrder />
        <Footer />
    </div>
  )
}

export default TrackOrderPage