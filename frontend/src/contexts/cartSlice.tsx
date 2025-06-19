import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartRoom {
    id: string;
    name: string;
    img: string;
    desc: string;
    price: number;
    nights: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    childrenUnder6: number;
    childrenOver6: number;
    bedAmount: number;
    view: string;
    total: number;
    hasSaturdayNight: boolean;
}

interface CartState {
    rooms: CartRoom[];
}

const initialState: CartState = {
    rooms: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addRoomToCart: (state, action: PayloadAction<CartRoom>) => {
            // Mỗi lần đặt là 1 phòng riêng biệt (không cộng dồn)
            state.rooms.push(action.payload);
        },
        removeRoomFromCart: (state, action: PayloadAction<string>) => {
            state.rooms = state.rooms.filter(room => room.id !== action.payload);
        },
        clearCart: (state) => {
            state.rooms = [];
        }
    }
});

export const { addRoomToCart, removeRoomFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;