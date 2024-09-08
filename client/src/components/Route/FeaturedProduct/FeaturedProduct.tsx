import { FC } from 'react';
import { useGetAllProductsQuery } from '../../../redux/features/product/productApi';
import styles from '../../../styles/styles';
import ProductCard from '../ProductCard/ProductCard';

// Define the shape of a product
interface Shop {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice: number;
  stock: number;
  images: { url: string }[];
  shop: Shop;
  ratings: number;
}

const FeaturedProduct: FC = () => {
  const { data: allProducts, isLoading, isError } = useGetAllProductsQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  if (!allProducts) {
    return <div>No events data available.</div>;
  }

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {allProducts.products && allProducts.products.length > 0 && (
            <>
              {allProducts.products.map((product: Product) => (
                <ProductCard key={product._id} data={product} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
