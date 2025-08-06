import { FC } from 'react';
import { useGetAllProductsQuery } from '../../../redux/features/product/productApi';
import ProductCard from '../ProductCard/ProductCard';
import { ProductData} from '../../../types';


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
      <div className='w-11/12 mx-auto'>
        <div className='text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]'>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {allProducts.products && allProducts.products.length > 0 && (
            <>
              {allProducts.products.map((product: ProductData) => (
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
