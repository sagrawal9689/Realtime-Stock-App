import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Price {
  symbol: string;
  price: number;
  timestamp: string;
}

interface PriceState {
  pricesBySymbol: { [key: string]: Price[] };
  selectedSymbol: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PriceState = {
  pricesBySymbol: {},
  selectedSymbol: 'bitcoin', // Default symbol
  status: 'idle',
  error: null,
};

export const fetchPrices = createAsyncThunk(
  'prices/fetchPrices',
  async (symbol: string) => {
    const response = await axios.get(`http://localhost:5000/api/prices/${symbol}`);
    return { symbol, prices: response.data };
  }
);

const priceSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    selectSymbol(state, action: PayloadAction<string>) {
      state.selectedSymbol = action.payload;
    },
    setPrices(state, action: any) {
        const { symbol} = action.payload;
        if (!state.pricesBySymbol[symbol]) {
          state.pricesBySymbol[symbol] = [];
        }
        // Add new price entry to the beginning
        state.pricesBySymbol[symbol].unshift(action.payload);
        // Ensure that only the last 20 prices are kept
        if (state.pricesBySymbol[symbol].length > 20) {
          state.pricesBySymbol[symbol].pop();
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pricesBySymbol[action.payload.symbol] = action.payload.prices;
      })
      .addCase(fetchPrices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch prices';
      });
  },
});

export const { selectSymbol, setPrices } = priceSlice.actions;
export default priceSlice.reducer;
