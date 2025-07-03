import { apiSlice } from '../api/apiSlice';
import { WishListItem } from '../../../types';

const getLocalWishList = (): WishListItem[] => {
  const rawData = localStorage.getItem('wishListItems');
  return JSON.parse(rawData || '[]');
};

const setLocalWishList = (wishList: WishListItem[]) => {
  localStorage.setItem('wishListItems', JSON.stringify(wishList));
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
          wishList[existingItemIndex].qty += newItem.qty;
        } else {
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