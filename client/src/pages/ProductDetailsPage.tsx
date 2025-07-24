import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useGetEventsQuery } from "../redux/features/event/eventApi";
import { useGetAllProductsQuery } from "../redux/features/product/productApi";
import { EventData, ProductData } from "../types";

type DetailData = ProductData | EventData;

const ProductDetailsPage: React.FC = () => {
  const { data: allProducts } = useGetAllProductsQuery({});
  const { data: allEvents } = useGetEventsQuery({});
  const { id } = useParams();
  const [data, setData] = useState<DetailData | null>(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  const products = useMemo(() => allProducts?.products || [], [allProducts]);
  const events = useMemo(() => allEvents?.events || [], [allEvents]);

  useEffect(() => {
    if (eventData !== null) {
      const eventItem = events?.find((i: EventData) => i._id === id);
      setData(eventItem || null);
    } else {
      const productItem = products?.find((i: ProductData) => i._id === id);
      setData(productItem || null);
    }
  }, [id, eventData, products, events]);

  return (
    <div>
      <Header activeHeading={0} />
      {data && !eventData && <ProductDetails data={data as ProductData} />}
      {data && eventData && (
        // You can create and use an EventDetails component if needed
        <div>Event details rendering not implemented</div>
      )}
      {!eventData && data && (
        <SuggestedProduct data={{ category: (data as ProductData).category ?? "" }} />
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
