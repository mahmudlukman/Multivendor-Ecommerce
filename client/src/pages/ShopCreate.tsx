import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from "../components/Shop/ShopCreate";
import { SellerState } from '../types';

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.auth);

  useEffect(() => {
    if(seller === true){
      navigate(`/shop/${seller._id}`);
    }
  }, [])
  return (
    <div>
        <ShopCreate />
    </div>
  )
}

export default ShopCreatePage