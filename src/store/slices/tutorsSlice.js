import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllTutors,
  createTutor,
  updateTutor,
  deleteTutor
} from '../../services/firestoreHelpers';

export const fetchTutors = createAsyncThunk(
  'tutors/fetchTutors',
  async (_, { rejectWithValue }) => {
    try {
      const [tutors] = await Promise.all([
        getAllTutors(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      return tutors;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add new tutor
export const addTutor = createAsyncThunk(
  'tutors/addTutor',
  async (tutorData, { rejectWithValue }) => {
    try {
      const newTutor = await createTutor(tutorData);
      return newTutor;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit tutor
export const editTutor = createAsyncThunk(
  'tutors/editTutor',
  async ({ id, tutorData }, { rejectWithValue }) => {
    try {
      const updatedTutor = await updateTutor(id, tutorData);
      return updatedTutor;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove tutor
export const removeTutor = createAsyncThunk(
  'tutors/removeTutor',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTutor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tutorsSlice = createSlice({
  name: 'tutors',
  initialState: {
    tutors: [],
    loading: false,
    initialLoading: true,
    error: null,
  },
  reducers: {
    clearTutorsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tutors
      .addCase(fetchTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.tutors = action.payload;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.initialLoading = false;
        state.error = action.payload;
      })
      // Add tutor
      .addCase(addTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors.push(action.payload);
      })
      .addCase(addTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit tutor
      .addCase(editTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTutor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tutors.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tutors[index] = { ...state.tutors[index], ...action.payload };
        }
      })
      .addCase(editTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove tutor
      .addCase(removeTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = state.tutors.filter(t => t.id !== action.payload);
      })
      .addCase(removeTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTutorsError } = tutorsSlice.actions;
export default tutorsSlice.reducer;