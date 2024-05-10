import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalsState {
  registerModal: boolean;
  loginModal: boolean;
  otpModal: boolean;
  forgetPassModal: boolean;
  changePassModal: boolean;
  productViewModal: {modal:boolean,image:string,magnifier:boolean};
  nextTabModal: string;
  userId: string;
  email: string;
}

const initialState: ModalsState = {
  registerModal: false,
  loginModal: false,
  otpModal: false,
  forgetPassModal: false,
  changePassModal: false,
  nextTabModal:"login",
  userId: "",
  email: "",
  productViewModal: {modal:false,image:"",magnifier:false},
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setRegisterModal: (state, action: PayloadAction<boolean>) => {
      state.registerModal = action.payload;
    },
    setLoginModal: (state, action: PayloadAction<boolean>) => {
      state.loginModal = action.payload;
    },
    setOtpModal: (state, action: PayloadAction<boolean>) => {
      state.otpModal = action.payload;
    },
    setForgetPassModal: (state, action: PayloadAction<boolean>) => {
      state.forgetPassModal = action.payload;
    },
    setChangePassModal: (state, action: PayloadAction<boolean>) => {
      state.changePassModal = action.payload;
    },
    setProductViewModal: (state, action: PayloadAction<any>) => {
      state.productViewModal = action.payload;
    },
    setNextTabModal: (state, action: PayloadAction<string>) => {
      state.nextTabModal = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setEmailId: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const {
  setRegisterModal,
  setLoginModal,setProductViewModal,
  setOtpModal,setEmailId,
  setForgetPassModal,setUserId,
  setChangePassModal,setNextTabModal
} = modalsSlice.actions;

export default modalsSlice.reducer;
