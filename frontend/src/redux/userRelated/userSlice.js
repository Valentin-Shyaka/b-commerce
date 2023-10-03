import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    userDetails: [],
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
    error: null,
    response: null,
    pages: ["Login/Register"],
    filteredProducts: [],
};

const updateCartDetailsInLocalStorage = (cartDetails) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    currentUser.cartDetails = cartDetails;
    localStorage.setItem('user', JSON.stringify(currentUser));
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading';
        },
        underControl: (state) => {
            state.status = 'idle';
            state.response = null;
        },
        stuffAdded: (state) => {
            state.status = 'idle';
            state.response = null;
            state.error = null;
        },
        authSuccess: (state, action) => {
            state.status = 'success';
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.response = null;
            state.error = null;
            if (action.payload.role === "Customer") {
                state.pages = ["Search"];
            }
            else if (action.payload.role === "Admin") {
                state.pages = ["Dashboard"];
            }
        },
        addToCart: (state, action) => {
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem.id === action.payload.id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const newCartItem = { ...action.payload, quantity: 1 };
                state.currentUser.cartDetails.push(newCartItem);
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        removeFromCart: (state, action) => {
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem.id === action.payload.id
            );

            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                } else {
                    const index = state.currentUser.cartDetails.findIndex(
                        (cartItem) => cartItem.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.currentUser.cartDetails.splice(index, 1);
                    }
                }
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails);
        },
        removeAllFromCart: (state) => {
            state.currentUser.cartDetails = [];
            updateCartDetailsInLocalStorage([]);
        },

        authFailed: (state, action) => {
            state.status = 'failed';
            state.response = action.payload;
        },
        authError: (state, action) => {
            state.status = 'error';
            state.error = action.payload;
        },
        authLogout: (state) => {
            localStorage.removeItem('user');
            state.status = 'idle';
            state.loading = true;
            state.currentUser = null;
            state.currentRole = null;
            state.error = null;
            state.response = true;
            state.pages = ["Login/Register"];
        },

        doneSuccess: (state, action) => {
            state.userDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getDeleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },

        getRequest: (state) => {
            state.loading = true;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setPages: (state, action) => {
            state.pages = action.payload;
        },
        setFilteredProducts: (state, action) => {
            state.filteredProducts = action.payload;
        },
    },
});

export const {
    authRequest,
    underControl,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
    setPages,
    setFilteredProducts,

    addToCart,
    removeFromCart,
    removeAllFromCart,
} = userSlice.actions;

export const userReducer = userSlice.reducer;