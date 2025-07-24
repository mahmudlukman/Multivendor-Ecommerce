import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import { useGetAllProductsQuery } from '../redux/features/product/productApi';
import { ProductData } from "../types";


const BestSellingPage = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const { data: productsData, isLoading } = useGetAllProductsQuery({});

  useEffect(() => {
    if (productsData && productsData.products) {
      const sortedData = productsData.products.map((product: ProductData) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        discountPrice: product.discountPrice,
        originalPrice: product.originalPrice,
        stock: product.stock,
        images: product.images,
        shop: product.shop,
        ratings: product.ratings,
        reviews: product.reviews || [],
        wishlist: product.wishlist || []
      }));
      setData(sortedData);
    }
  }, [productsData]);

  const [open, setOpen] = useState(false);

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
              {data.map((product) => (
                <ProductCard
                  data={product}
                  key={product._id}
                  open={open}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;