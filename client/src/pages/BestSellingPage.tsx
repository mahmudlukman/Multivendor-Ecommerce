import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import { useGetAllProductsQuery } from '../redux/features/product/productApi';

interface Shop {
  _id: string;
  name: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice: number;
  stock: number;
  images: { url: string }[];
  shop: Shop;
  ratings: number;
  sold_out: number;
}

const BestSellingPage = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const { data: productsData, isLoading } = useGetAllProductsQuery({});

  useEffect(() => {
    if (productsData && productsData.products) {
      const sortedData = [...productsData.products]
        .sort((a, b) => b.sold_out - a.sold_out)
        .map(product => ({
          _id: product._id,
          name: product.name,
          description: product.description,
          discountPrice: product.discountPrice,
          originalPrice: product.originalPrice,
          stock: product.stock,
          images: product.images,
          shop: product.shop,
          ratings: product.ratings,
          sold_out: product.sold_out
        }));
      setData(sortedData);
    }
  }, [productsData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data.map((product) => <ProductCard data={product} key={product._id} />)}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;