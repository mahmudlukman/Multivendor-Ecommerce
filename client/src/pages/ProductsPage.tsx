import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import Loader from '../components/Layout/Loader';
import ProductCard from '../components/Route/ProductCard/ProductCard';
import styles from '../styles/styles';
import { useGetAllProductsQuery } from '../redux/features/product/productApi';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get('category');
  const { data, isLoading } = useGetAllProductsQuery({});
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data && data.products) {
      if (categoryData === null) {
        setFilteredData(data.products);
      } else {
        const filtered = data.products.filter(
          (i: any) => i.category === categoryData
        );
        setFilteredData(filtered);
      }
    }
  }, [data, categoryData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {filteredData &&
                filteredData.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </div>
            {filteredData && filteredData.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products Found!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
