import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const asyncRegister = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await api.register({ name, email, password });
      // After register, usually we ask user to login or auto-login. Content doesn't specify. 
      // Returning null or success message.
      return { email }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncLogin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      const user = await api.getOwnProfile();
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check if user is already logged in on app load
export const asyncPreloadProcess = createAsyncThunk(
  'auth/preload',
  async (_, { rejectWithValue }) => {
    try {
      const token = api.getAccessToken();
      if (!token) return null;
      const user = await api.getOwnProfile();
      return user;
    } catch (error) {
      // If token invalid, remove it
      api.removeAccessToken();
      return rejectWithValue(error.message);
    }
  }
);

export const asyncLogout = createAsyncThunk(
  'auth/logout',
  async () => {
    api.removeAccessToken();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isPreload: true, // For initial loading screen
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        // Login
      .addCase(asyncLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(asyncLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
        // Preload
      .addCase(asyncPreloadProcess.pending, (state) => {
        state.isPreload = true;
      })
      .addCase(asyncPreloadProcess.fulfilled, (state, action) => {
        state.isPreload = false;
        state.user = action.payload; // null if no token, user obj if valid
      })
      .addCase(asyncPreloadProcess.rejected, (state) => {
        state.isPreload = false;
        state.user = null;
      })
        // Logout
      .addCase(asyncLogout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
