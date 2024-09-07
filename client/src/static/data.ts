import React, { FC } from 'react';
import FreeShippingIcon from '../icons/FreeShipping.svg?react';
import DailySurpriseIcon from '../icons/DailySuprise.svg?react';
import AffordablePricesIcon from '../icons/AffordablePrices.svg?react';
import SecurePaymentsIcon from '../icons/SecurePayments.svg?react';

// Navigation Data
interface NavItem {
  title: string;
  url: string;
}

export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Best Selling',
    url: '/best-selling',
  },
  {
    title: 'Products',
    url: '/products',
  },
  {
    title: 'Events',
    url: '/events',
  },
  {
    title: 'FAQ',
    url: '/faq',
  },
];

interface BrandingItem {
  id: number;
  title: string;
  description: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
}

export const brandingData: BrandingItem[] = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'From all orders over 100$',
    icon: FreeShippingIcon,
  },
  {
    id: 2,
    title: 'Daily Surprise Offers',
    description: 'Save up to 25% off',
    icon: DailySurpriseIcon,
  },
  {
    id: 4,
    title: 'Affortable Prices',
    description: 'Get Factory direct price',
    icon: AffordablePricesIcon,
  },
  {
    id: 5,
    title: 'Secure Payments',
    description: '100% protected payments',
    icon: SecurePaymentsIcon,
  },
];

// categories data
export const categoriesData = [
  {
    id: 1,
    title: 'Computers and Laptops',
    subTitle: '',
    image_Url:
      'https://cdn.shopify.com/s/files/1/1706/9177/products/NEWAppleMacbookProwithM1ProChip14InchLaptop2021ModelMKGQ3LL_A_16GB_1TBSSD_custommacbd.jpg?v=1659592838',
  },
  {
    id: 2,
    title: 'cosmetics and body care',
    subTitle: '',
    image_Url:
      'https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2021-07/kosme1.png',
  },
  {
    id: 3,
    title: 'Accesories',
    subTitle: '',
    image_Url:
      'https://img.freepik.com/free-vector/ordering-goods-online-internet-store-online-shopping-niche-e-commerce-website-mother-buying-babies-clothes-footwear-toys-infant-accessories_335657-2345.jpg?w=2000',
  },
  {
    id: 4,
    title: 'Cloths',
    subTitle: '',
    image_Url:
      'https://www.shift4shop.com/2015/images/industries/clothing/clothing-apparel.png',
  },
  {
    id: 5,
    title: 'Shoes',
    subTitle: '',
    image_Url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvBQPQMVNRd6TtDkGs2dCri0Y-rxKkFOiEWw&usqp=CAU',
  },
  {
    id: 6,
    title: 'Gifts',
    subTitle: '',
    image_Url:
      'https://img.freepik.com/free-vector/vector-realistic-christmas-new-year-background-banner-flyer-greeting-card-postcard-horizont_134830-1075.jpg?t=st=1725714745~exp=1725718345~hmac=604761aa3715f28907b41da5906ef780ef6c58c8a3de7b3c7a6224da0cb4380b&w=900',
  },
  {
    id: 7,
    title: 'Pet Care',
    subTitle: '',
    image_Url: 'https://cdn.openpr.com/T/c/Tc15444071_g.jpg',
  },
  {
    id: 8,
    title: 'Mobile and Tablets',
    subTitle: '',
    image_Url:
      'https://st-troy.mncdn.com/mnresize/1500/1500/Content/media/ProductImg/original/mpwp3tua-apple-iphone-14-256gb-mavi-mpwp3tua-637986832343472449.jpg',
  },
  {
    id: 9,
    title: 'Music and Gaming',
    subTitle: '',
    image_Url:
      'https://static.vecteezy.com/system/resources/previews/011/996/555/original/3d-black-headphone-illustration-ecommerce-icon-png.png',
  },
  {
    id: 10,
    title: 'Others',
    subTitle: '',
    image_Url:
      'https://searchspring.com/wp-content/uploads/2022/10/Hero-Image-Platform-Others-2.png',
  },
];

// product Data
export const productData = [
  {
    id: 1,
    category: 'Computers and Laptops',
    name: 'MacBook Pro M2 Chipset 256GB SSD 8GB RAM Space-Gray Color with Apple 1 Year Warranty',
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: 'test',
        url: 'https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png',
      },
      {
        public_id: 'test',
        url: 'https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png',
      },
    ],
    shop: {
      name: 'Apple Inc.',
      shop_avatar: {
        public_id: 'test',
        url: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      },
      ratings: 4.2,
    },
    price: 1099,
    discount_price: 1049,
    rating: 4,
    total_sell: 35,
    stock: 10,
  },
  {
    id: 2,
    category: 'Mobile and Tablets',
    name: 'iPhone 14 Pro Max 256GB SSD and 8GB RAM Silver Color',
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: 'test',
        url: 'https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg',
      },
      {
        public_id: 'test',
        url: 'https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg',
      },
    ],
    shop: {
      name: 'Amazon Ltd',
      shop_avatar: {
        public_id: 'test',
        url: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      },
      ratings: 4.2,
    },
    price: 1199,
    discount_price: 1099,
    rating: 5,
    total_sell: 80,
    stock: 10,
  },
  {
    id: 3,
    category: 'Others',
    name: 'New Fashionable Watch for Men 2023 with Multiple Colors',
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: 'test',
        url: 'https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1',
      },
      {
        public_id: 'test',
        url: 'https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1',
      },
    ],
    shop: {
      name: 'Shahriar Watch House',
      shop_avatar: {
        public_id: 'test',
        url: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      },
      ratings: 4.2,
    },
    price: 100,
    discount_price: 79,
    rating: 4,
    total_sell: 62,
    stock: 10,
  },
  {
    id: 4,
    category: 'Shoes',
    name: 'New Trend Shoes for Gents with All Sizes',
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: 'test',
        url: 'https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg',
      },
      {
        public_id: 'test',
        url: 'https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg',
      },
    ],
    shop: {
      name: 'Alisha Shoes Mart',
      shop_avatar: {
        public_id: 'test',
        url: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      },
      ratings: 4.2,
    },
    price: 120,
    discount_price: 89,
    rating: 5,
    total_sell: 49,
    stock: 10,
  },
  {
    id: 5,
    category: 'Music and Gaming',
    name: 'Gaming Headphone Asus with Multiple Colors and Free Delivery',
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: 'test',
        url: 'https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg',
      },
      {
        public_id: 'test',
        url: 'https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg',
      },
    ],
    shop: {
      name: 'Asus Ltd',
      shop_avatar: {
        public_id: 'test',
        url: 'https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png',
      },
      ratings: 4.2,
    },
    price: 300,
    discount_price: 239,
    rating: 4.5,
    reviews: [
      {
        user: {
          // user object will be here
        },
        comment: "It's so cool!",
        rating: 5,
      },
    ],
    total_sell: 20,
    stock: 10,
  },
];

export const footerProductLinks = [
  {
    name: 'About us',
    link: '/about',
  },
  {
    name: 'Careers',
    link: '/careers',
  },
  {
    name: 'Store Locations',
    link: '/locations',
  },
  {
    name: 'Our Blog',
    link: '/blog',
  },
  {
    name: 'Reviews',
    link: '/reviews',
  },
];

export const footercompanyLinks = [
  {
    name: 'Game & Video',
    link: '/products/game-video',
  },
  {
    name: 'Phone & Tablets',
    link: '/products/phone-tablets',
  },
  {
    name: 'Computers & Laptop',
    link: '/products/computers-laptop',
  },
  {
    name: 'Sport Watches',
    link: '/products/sport-watches',
  },
  {
    name: 'Events',
    link: '/events',
  },
];

export const footerSupportLinks = [
  {
    name: 'FAQ',
    link: '/faq',
  },
  {
    name: 'Reviews',
    link: '/reviews',
  },
  {
    name: 'Contact Us',
    link: '/contact',
  },
  {
    name: 'Shipping',
    link: '/shipping',
  },
  {
    name: 'Live chat',
    link: '/chat',
  },
];
