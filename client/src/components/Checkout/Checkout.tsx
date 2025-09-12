import { useState, useEffect, FormEvent } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useGetCouponValueQuery } from "../../redux/features/couponCode/couponCodeApi";
import { RootState, User, CartItem, CouponCode } from "../../types";
import { useGetCartQuery } from "../../redux/features/cart/cartApi";

// Interfaces for country-state-city (minimal)
interface CountryData {
  isoCode: string;
  name: string;
}

interface StateData {
  isoCode: string;
  name: string;
}

// Interface for order data (for localStorage)
interface OrderData {
  cart: CartItem[];
  totalPrice: number | string;
  subTotalPrice: number;
  shipping: number;
  discountPrice: number | null;
  shippingAddress: {
    address1: string;
    address2?: string;
    zipCode: string;
    country: string;
    city: string;
  };
  user: User | null;
}

const Checkout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: cart } = useGetCartQuery(undefined);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [userInfo, setUserInfo] = useState<boolean>(false);
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [couponCodeData, setCouponCodeData] = useState<CouponCode | null>(null);
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [triggerCouponSearch, setTriggerCouponSearch] =
    useState<boolean>(false);
  const [searchCouponName, setSearchCouponName] = useState<string>("");
  const navigate = useNavigate();

  // RTK Query hook for getting coupon value
  const {
    data: couponResponse,
    error: couponError,
    isLoading: couponLoading,
    isSuccess: couponSuccess,
  } = useGetCouponValueQuery(searchCouponName, {
    skip: !triggerCouponSearch || !searchCouponName,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle coupon response
  useEffect(() => {
    if (couponSuccess && couponResponse && triggerCouponSearch) {
      const shopId = couponResponse.couponCode?.shopId;
      const couponCodeValue = couponResponse.couponCode?.value;

      if (couponResponse.couponCode) {
        const isCouponValid = cart?.filter((item) => item.shopId === shopId);

        if (!isCouponValid || isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discount = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discount);
          setCouponCodeData(couponResponse.couponCode);
          setCouponCode("");
        }
      } else {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }

      // Reset trigger
      setTriggerCouponSearch(false);
      setSearchCouponName("");
    }
  }, [couponSuccess, couponResponse, triggerCouponSearch, cart]);

  // Handle coupon error
  useEffect(() => {
    if (couponError && triggerCouponSearch) {
      toast.error("Coupon code doesn't exist!");
      setCouponCode("");
      setTriggerCouponSearch(false);
      setSearchCouponName("");
    }
  }, [couponError, triggerCouponSearch]);

  const paymentSubmit = () => {
    if (!address1 || !zipCode || !country || !city) {
      toast.error("Please fill in all delivery address fields!");
      return;
    }

    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData: OrderData = {
      cart: cart || [],
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    };

    // Update local storage with the updated order
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/user/payment");
  };

  const subTotalPrice =
    cart?.reduce((acc, item) => acc + item.qty * item.discountPrice, 0) || 0;

  // Shipping cost
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setSearchCouponName(couponCode);
    setTriggerCouponSearch(true);
  };

  const discountPercentage = discountPrice ?? 0;

  const totalPrice = (subTotalPrice + shipping - discountPercentage).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={Number(totalPrice)}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
            couponLoading={couponLoading}
          />
        </div>
      </div>
      <button
        className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer w-[150px] 800px:w-[280px] mt-10'
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </button>
    </div>
  );
};

interface ShippingInfoProps {
  user: User | null;
  country: string;
  setCountry: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  userInfo: boolean;
  setUserInfo: (value: boolean) => void;
  address1: string;
  setAddress1: (value: string) => void;
  address2?: string;
  setAddress2: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
}

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}: ShippingInfoProps) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-medium">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user?.name || ""}
              required
              readOnly
              className='w-full border p-1 rounded-[5px] w-[95%]!`'
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              required
              readOnly
              className='w-full border p-1 rounded-[5px]'
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user?.phoneNumber || ""}
              readOnly
              className='w-full border p-1 rounded-[5px] w-[95%]!'
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className='w-full border p-1 rounded-[5px]'
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country.getAllCountries().map((item: CountryData) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your City</option>
              {State.getStatesOfCountry(country).map((item: StateData) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className='w-full border p-1 rounded-[5px] w-[95%]!'
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className='w-full border p-1 rounded-[5px]'
            />
          </div>
        </div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user?.addresses.map((item, index) => (
            <div key={index} className="w-full flex mt-1">
              <input
                type="checkbox"
                className="mr-3"
                value={item.addressType}
                onChange={() => {
                  setAddress1(item.address1);
                  setAddress2(item.address2);
                  setZipCode(item.zipCode);
                  setCountry(item.country);
                  setCity(item.city);
                }}
              />
              <h2>{item.addressType}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CartDataProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  totalPrice: number;
  shipping: number;
  subTotalPrice: number;
  couponCode: string;
  setCouponCode: (value: string) => void;
  discountPercentage: number;
  couponLoading: boolean;
}

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
  couponLoading,
}: CartDataProps) => {
  return (
    <div className="w-full bg-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-normal text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-semibold">₦{subTotalPrice.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-normal text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-semibold">₦{shipping.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-normal text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-semibold">
          {discountPercentage > 0 ? `₦${discountPercentage.toFixed(2)}` : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-semibold text-end pt-3">
        ₦{totalPrice.toFixed(2)}
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className='w-full border p-1 rounded-[5px] h-[40px] pl-2'
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer ${
            couponLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          value={couponLoading ? "Applying..." : "Apply code"}
          type="submit"
          disabled={couponLoading}
        />
      </form>
    </div>
  );
};

export default Checkout;
