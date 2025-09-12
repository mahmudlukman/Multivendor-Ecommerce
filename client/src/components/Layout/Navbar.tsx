import { FC } from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';


interface NavItem {
  title: string;
  url: string;
}

interface Props {
  active: number;
}

const Navbar: FC<Props> = ({ active }) => {
  return (
    <div className="flex justify-center items-center w-full py-4">
      {navItems &&
        navItems.map((item: NavItem, index: number) => (
          <div className="flex" key={index}>
            <Link
              to={item.url}
              className={`${
                active === index + 1
                  ? 'text-[#17dd1f]'
                  : 'text-black 800px:text-white'
              } pb-[30px] 800px:pb-0 font-medium px-6 cursor-pointer}`}
            >
              {item.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
