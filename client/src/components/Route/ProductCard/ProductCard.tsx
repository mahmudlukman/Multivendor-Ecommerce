import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/styles';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard';

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
}

interface Props {
  data: ProductData;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const ProductCard: React.FC<Props> = ({ data, open, setOpen }) => {
  const [click, setClick] = useState(false);

  const handleProductClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`/product/${data._id}`}>
          <img
            src={data.images && data.images[0]?.url}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
        <Link to={`/product/${data._id}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}₦
            </h5>
            <h4 className={`${styles.price}`}>
              {data.originalPrice ? data.originalPrice + " ₦" : null}
            </h4>
          </div>
        </Link>

        {/* added this button to open the ProductDetailsCard */}
        <button onClick={handleProductClick} className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded">
          View Details
        </button>
      </div>

      {open && (
        <ProductDetailsCard
          setOpen={setOpen}
          data={data}
          open={open}
        />
      )}
    </>
  );
};

export default ProductCard;