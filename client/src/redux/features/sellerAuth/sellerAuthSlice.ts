import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  seller: '',
};

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    sellerRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    sellerLoggedIn: (
      state,
      action: PayloadAction<{ sellerToken: string; seller: string }>
    ) => {
      state.token = action.payload.sellerToken;
      state.seller = action.payload.seller;
    },
    sellerLoggedOut: (state) => {
      (state.token = ''), (state.seller = '');
    },
  },
});

export const { sellerRegistration, sellerLoggedIn, sellerLoggedOut } =
  sellerAuthSlice.actions;

export default sellerAuthSlice.reducer;
