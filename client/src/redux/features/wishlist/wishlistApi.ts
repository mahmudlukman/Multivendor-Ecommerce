import { apiSlice } from '../api/apiSlice';

interface WishListItem {
  _id: string;
  name: string;
  images: { url: string }[];
  discountPrice: number;
  qty: number;
  stock: number;
}

const getLocalWishList = (): WishListItem[] => {
  return JSON.parse(localStorage.getItem('wishListItems') || '[]');
};

const setLocalWishList = (wishList: WishListItem[]) => {
  localStorage.setItem('WishListItems', JSON.stringify(wishList));
};

export const WishListApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishList: builder.query<WishListItem[], void>({
      queryFn: () => {
        const wishList = getLocalWishList();
        return { data: wishList };
      },
      providesTags: ['WishList'],
    }),
    addToWishList: builder.mutation<WishListItem[], WishListItem>({
      queryFn: (newItem) => {
        const wishList = getLocalWishList();
        const existingItemIndex = wishList.findIndex(item => item._id === newItem._id);
        
        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          wishList[existingItemIndex].qty += newItem.qty;
        } else {
          // New item, add to wishList
          wishList.push(newItem);
        }
        
        setLocalWishList(wishList);
        return { data: wishList };
      },
      invalidatesTags: ['WishList'],
    }),
    removeFromWishList: builder.mutation<WishListItem[], string>({
      queryFn: (id) => {
        let wishList = getLocalWishList();
        wishList = wishList.filter(item => item._id !== id);
        setLocalWishList(wishList);
        return { data: wishList };
      },
      invalidatesTags: ['WishList'],
    }),
    updateWishListItemQuantity: builder.mutation<WishListItem[], { id: string, qty: number }>({
      queryFn: ({ id, qty }) => {
        const wishList = getLocalWishList();
        const itemIndex = wishList.findIndex(item => item._id === id);
        if (itemIndex !== -1) {
          wishList[itemIndex].qty = qty;
          setLocalWishList(wishList);
        }
        return { data: wishList };
      },
      invalidatesTags: ['WishList'],
    }),
  }),
});

export const {
  useGetWishListQuery,
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
  useUpdateWishListItemQuantityMutation
} = WishListApi;