import { useEffect, useState, FC } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../../styles/styles';
import ProductCard from '../ProductCard/ProductCard';
import { useGetAllProductsQuery } from '../../../redux/features/product/productApi';

// Define the shape of your product object
interface Product {
  id: string;
  name: string;
  sold_out: number;
  // Add other properties as needed
}


const BestDeals: FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const { data: allProducts } = useGetAllProductsQuery({});

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data && data.length !== 0 && (
            <>
              {data.map((item, index) => (
                <ProductCard data={item} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
