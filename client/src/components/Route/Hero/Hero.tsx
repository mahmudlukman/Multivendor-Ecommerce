import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div
      className='relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat flex items-center w-full'
      style={{
        backgroundImage:
          'url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)',
      }}
    >
      <div className='w-11/12 mx-auto w-[90%] 800px:w-[60%]'>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-semibold capitalize`}
        >
          Best Collection for <br /> home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-normal text-[#000000ba]">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
          assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
          quidem asperiores, laudantium temporibus soluta optio consequatur{' '}
          <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
        </p>
        <Link to="/products" className="inline-block">
          <div className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mt-5'>
            <span className="text-white font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
