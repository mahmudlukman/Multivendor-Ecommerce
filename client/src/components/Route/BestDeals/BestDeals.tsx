import { useEffect, useState, FC } from 'react';
import { useGetAllProductsQuery } from '../../../redux/features/product/productApi';
import styles from '../../../styles/styles';
import ProductCard from '../ProductCard/ProductCard';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice: number;
  stock: number;
  images: { url: string }[];
  shop: {
    _id: string;
    name: string;
  };
  ratings: number;
  sold_out: number;
}

const BestDeals: FC = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const { data: allProductsData, error, isLoading } = useGetAllProductsQuery({});

  useEffect(() => {
    if (allProductsData && Array.isArray(allProductsData)) {
      const sortedData = [...allProductsData].sort((a, b) => b.sold_out - a.sold_out);
      const firstFive = sortedData.slice(0, 5);
      setData(firstFive);
    } else if (allProductsData && 'products' in allProductsData && Array.isArray(allProductsData.products)) {
      const sortedData = [...allProductsData.products].sort((a, b) => b.sold_out - a.sold_out);
      const firstFive = sortedData.slice(0, 5);
      setData(firstFive);
    }
  }, [allProductsData]);

  const handleSetOpen = (id: string, isOpen: boolean) => {
    setOpenProductId(isOpen ? id : null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data.length > 0 ? (
            data.map((item) => (
              <ProductCard
                key={item._id}
                data={item}
                open={item._id === openProductId}
                setOpen={(isOpen) => handleSetOpen(item._id, isOpen)}
              />
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;