import { FC, useEffect, useState } from 'react';
import styles from '../../styles/styles';
import ProductCard from '../Route/ProductCard/ProductCard';
import { useGetAllProductsQuery } from '../../redux/features/product/productApi';
import { ProductData} from '../../types';

interface SuggestedProductProps {
  data: {
    category: string;
  };
}

const SuggestedProduct: FC<SuggestedProductProps> = ({ data }) => {
  const { data: allProducts } = useGetAllProductsQuery({});
  const [productData, setProductData] = useState<ProductData[] | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = allProducts && allProducts?.products.filter((i: ProductData) => i.category === data.category);
    setProductData(d);
  }, [allProducts, data.category]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData &&
              productData.map((item, idx) => (
                <ProductCard
                  data={item}
                  key={item._id || idx}
                  open={open}
                  setOpen={setOpen}
                />
              ))
            }
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;