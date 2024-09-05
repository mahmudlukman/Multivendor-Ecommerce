import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

interface Category {
  title: string;
  image_Url: string;
}

interface Props {
  categoriesData: Category[];
  setDropDown: (value: boolean) => void;
}

const DropDown: FC<Props> = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (category: Category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((category, index) => (
          <div
            key={index}
            className={`${styles.noramlFlex}`}
            onClick={() => submitHandle(category)}
          >
            <img
              src={category.image_Url}
              style={{
                width: '25px',
                height: '25px',
                objectFit: 'contain',
                marginLeft: '10px',
                userSelect: 'none',
              }}
              alt={category.title}
            />
            <h3 className="m-3 cursor-pointer select-none">{category.title}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
