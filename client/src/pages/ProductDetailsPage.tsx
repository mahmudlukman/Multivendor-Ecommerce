import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import ProductDetails from '../components/Products/ProductDetails';
import SuggestedProduct from '../components/Products/SuggestedProduct';
import { useGetEventsQuery } from '../redux/features/event/eventApi';
import { useGetAllProductsQuery } from '../redux/features/product/productApi';

interface Image {
  url: string;
}

interface Shop {
  _id: string;
  name: string;
  avatar: Image;
  description: string;
  createdAt: string;
}

interface Review {
  user: {
    name: string;
    avatar: Image;
  };
  rating: number;
  comment: string;
}

interface WishlistItem {
  _id: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  images: Image[];
  shop: Shop;
  discountPrice: number;
  originalPrice?: number;
  stock: number;
  reviews: Review[];
  ratings: number;
  wishlist: WishlistItem[];
  category: string; // Add this line
}


interface EventData {
  _id: string;
  name: string;
  description: string;
  images: Image[];
  shop: Shop;
  reviews: Review[];
  ratings: number;
  price: number;
  stock: number;
  discountPrice: number;
  start_Date: string;
  Finish_Date: string;
  wishlist: WishlistItem[];
}

type DetailData = ProductData | EventData;

const ProductDetailsPage: React.FC = () => {
  const { data: allProducts } = useGetAllProductsQuery({});
  const { data: allEvents } = useGetEventsQuery({});
  const { id } = useParams();
  const [data, setData] = useState<DetailData | null>(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');

  useEffect(() => {
    if (eventData !== null) {
      const eventItem = allEvents?.find((i: EventData) => i._id === id);
      setData(eventItem || null);
    } else {
      const productItem = allProducts?.find((i: ProductData) => i._id === id);
      setData(productItem || null);
    }
  }, [allProducts, allEvents, id, eventData]);

  return (
    <div>
      <Header activeHeading={0} />
      {data && <ProductDetails data={data} />}
      {!eventData && data && <SuggestedProduct data={data as ProductData} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;