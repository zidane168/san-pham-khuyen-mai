import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { vouchersData } from '../data/vouchers';

interface Voucher {
  id: number;
  categoryId: number;
  videoLink?: string;
  affiliateLink?: string;
  voucherLink?: string;
  title: string;
  description: string;
}

interface Pagination {
  count: number;
  totalPage: number;
}

interface VouchersResponse {
  _pagination: Pagination;
  data: Voucher[];
}

interface VouchersState {
  vouchers: Voucher[];
  pagination: Pagination | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VouchersState = {
 vouchers: [],
  pagination: null,
  status: 'idle',
  error: null,
};

export const fetchVouchers = createAsyncThunk<VouchersResponse, { page: number, limit: number }>(
  'vouchers/fetchVouchers',
  async ( arg ) => {
    const { page, limit } = arg; 

    await new Promise(resolve => setTimeout(resolve, 100));  
    return vouchersData;    // if env.mockup == TRUE

    // const response = await fetch(`http://localhost:3000/products?page=${page}&limit=${limit}`);  // call API if can setup API
    // console.log ('------------------------ ')
    // console.log (response)
    // console.log ('------------------------ ')
    // if (!response.ok) {
    //   throw new Error('Failed to fetch products xD');
    // }
    // return await response.json() as ProductsResponse;
  }
);

const vouchersSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVouchers.fulfilled, (state, action: PayloadAction<VouchersResponse>) => {
        state.status = 'succeeded';
        state.vouchers = [ ...state.vouchers,  ...action.payload.data ];

        // replace data when recall the fetchs, (no load more )
        // state.items = action.payload.data; 
        // state.pagination = action.payload._pagination;

        state.pagination = {
          count: state.vouchers.length,
          totalPage: action.payload._pagination.totalPage
        }
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch vouchers';
      });
  },
});

export default vouchersSlice.reducer;