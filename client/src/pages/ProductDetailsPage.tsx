import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import ProductDetails from '../components/Products/ProductDetails';
import SuggestedProduct from '../components/Products/SuggestedProduct';
import { useGetEventsQuery } from '../redux/features/event/eventApi';
import { useGetAllProductsQuery } from '../redux/features/product/productApi';

const ProductDetailsPage = () => {
  const { data: allProducts } = useGetAllProductsQuery({});
  const { data: allEvents } = useGetEventsQuery({});
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i: any) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i: any) => i._id === id);
      setData(data);
    }
  }, [allProducts, allEvents]);

  return (
    <div>
      <Header activeHeading={0} />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
