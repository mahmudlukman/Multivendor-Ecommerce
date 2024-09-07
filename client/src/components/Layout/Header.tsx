import { useState, ChangeEvent, FC } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/styles';
import { categoriesData } from '../../static/data';
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import DropDown from './DropDown';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RxCross1 } from 'react-icons/rx';
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from '../../redux/features/cart/cartApi';
import { useGetAllProductsQuery } from '../../redux/features/product/productApi';

interface Props {
  activeHeading: number;
}

interface Product {
  _id: string;
  name: string;
  images: { url: string }[];
  image_Url: { url: string }[];
}

interface State {
  auth: {
    user: {
      avatar: { url: string };
    };
  };
  seller: {
    isSeller: boolean;
  };
  wishlist: Product[];
  cart: Product[];
}

const Header: FC<Props> = ({ activeHeading }) => {
  const { user } = useSelector((state: State) => state.auth);
  // const { isSeller } = useSelector((state: State) => state.seller);
  const { data: cart } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const { data: allProducts } = useGetAllProductsQuery({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchData, setSearchData] = useState<Product[] | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openWishlist, setOpenWishlist] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product: Product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((product: Product) => (
                    <Link to={`/product/${product._id}`} key={product._id}>
                      <div className="w-full flex items-start py-3">
                        <img
                          src={`${product.images[0]?.url}`}
                          alt=""
                          className="w-[40px] h-[40px] mr-[10px]"
                        />
                        <h1>{product.name}</h1>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : null}
          </div>

          <div className={`${styles.button}`}>
            <Link to="/shop-create">
              <h1 className="text-[#fff] flex items-center">
                Become Seller <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
            {/* <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go Dashboard" : "Become Seller"} <IoIosArrowForward className="ml-1" />
              </h1>
            </Link> */}
          </div>
        </div>
      </div>
      <div
        className={`${
          active ? 'shadow-sm fixed top-0 left-0 z-10' : ''
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {user ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {/* {openCart && <Cart setOpenCart={setOpenCart} />}

            {/* wishlist popup */}
            {/* {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />} */}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active ? 'shadow-sm fixed top-0 left-0 z-10' : ''
        } w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
                className="mt-3 cursor-pointer"
              />
            </Link>
          </div>
          <div className="relative mr-[20px]">
            <AiOutlineShoppingCart size={30} />
            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
              {cart && cart.length}
            </span>
          </div>
        </div>

        {/* header sidebar */}
        {open ? (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[60%] bg-[#fff] h-screen top-0 left-0 z-10">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                      {cart && cart.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                />
                <AiOutlineSearch
                  size={30}
                  className="absolute right-2 top-1.5 cursor-pointer"
                />
                {searchData && searchData.length !== 0 ? (
                  <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                    {searchData &&
                      searchData.map((product: Product) => (
                        <Link to={`/product/${product._id}`} key={product._id}>
                          <div className="w-full flex items-start py-3">
                            <img
                              src={`${product.images[0]?.url}`}
                              alt=""
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{product.name}</h1>
                          </div>
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
                {/* <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                  <h1 className="text-[#fff] flex items-center">
                    {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                    <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link> */}
              </div>
              <div className="flex w-full justify-center">
                {user ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-[#3957db]"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Header;
