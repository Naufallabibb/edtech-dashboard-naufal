import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getUpcomingBookings,
  getWeeklyBookingsData
} from '../../services/firestoreHelpers';

// Helper function to sort bookings by date and time (nearest first)
const sortBookingsByDateTime = (bookings) => {
  return bookings.sort((a, b) => {
    // Compare dates first
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    // If dates are equal, compare start times
    return a.startTime.localeCompare(b.startTime);
  });
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const [bookings] = await Promise.all([
        getAllBookings(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      // Sort by date and time (nearest first)
      const sortedBookings = sortBookingsByDateTime([...bookings]);
      return sortedBookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpcomingBookings = createAsyncThunk(
  'bookings/fetchUpcomingBookings',
  async (_, { rejectWithValue }) => {
    try {
      const upcomingBookings = await getUpcomingBookings();
      // Already sorted in firestoreHelpers, but ensure consistency
      return sortBookingsByDateTime([...upcomingBookings]);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeeklyBookingsData = createAsyncThunk(
  'bookings/fetchWeeklyBookingsData',
  async (_, { rejectWithValue }) => {
    try {
      return await getWeeklyBookingsData();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBooking = createAsyncThunk(
  'bookings/addBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      return await createBooking(bookingData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editBooking = createAsyncThunk(
  'bookings/editBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      return await updateBooking(id, bookingData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeBooking = createAsyncThunk(
  'bookings/removeBooking',
  async (id, { rejectWithValue }) => {
    try {
      await deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    upcomingBookings: [],
    weeklyData: [],
    loading: false,
    initialLoading: true,
    error: null,
  },
  reducers: {
    clearBookingsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
        state.upcomingBookings = action.payload;
      })
      .addCase(fetchWeeklyBookingsData.fulfilled, (state, action) => {
        state.weeklyData = action.payload;
      })
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Add new booking and re-sort by date/time
        state.bookings = sortBookingsByDateTime([...state.bookings, action.payload]);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = { ...state.bookings[index], ...action.payload };
        }
        // Re-sort after edit (in case date/time changed)
        state.bookings = sortBookingsByDateTime([...state.bookings]);
      })
      .addCase(editBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(b => b.id !== action.payload);
      })
      .addCase(removeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingsError } = bookingsSlice.actions;
export default bookingsSlice.reducer;