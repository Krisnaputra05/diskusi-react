import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { asyncLogin, asyncLogout } from './authSlice';
import api from '../../services/api';

// Mock API
vi.mock('../../services/api');

describe('authSlice', () => {
  describe('reducers', () => {
    it('should handle initial state', () => {
      const initialState = {
        user: null,
        isPreload: true,
        status: 'idle',
        error: null,
      };
      // eslint-disable-next-line
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle asyncLogin.fulfilled', () => {
        const initialState = {
            user: null,
            isPreload: false,
            status: 'loading',
            error: null,
        };
        const action = { 
             type: asyncLogin.fulfilled.type, 
             payload: { user: { id: '1', name: 'User' }, token: 'xyz' } 
        };
        const state = authReducer(initialState, action);
        expect(state.user).toEqual({ id: '1', name: 'User' });
        expect(state.status).toEqual('succeeded');
    });

    it('should handle asyncLogout.fulfilled', () => {
        const initialState = {
            user: { id: '1', name: 'User' },
            isPreload: false,
            status: 'idle',
            error: null,
        };
         const action = { type: asyncLogout.fulfilled.type };
         const state = authReducer(initialState, action);
         expect(state.user).toEqual(null);
    });
  });

  describe('thunks', () => {
     beforeEach(() => {
        vi.clearAllMocks();
     });

     it('asyncLogin should dispatch fulfilled action on success', async () => {
         const mockUser = { id: '1', name: 'User' };
         const mockToken = 'auth-token';
         
         api.login.mockResolvedValue(mockToken);
         api.getOwnProfile.mockResolvedValue(mockUser);
         api.putAccessToken.mockImplementation(() => {});

         const dispatch = vi.fn();
         const getState = vi.fn();

         await asyncLogin({ email: 'test@test.com', password: '123' })(dispatch, getState, undefined);

         expect(api.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123' });
         expect(api.putAccessToken).toHaveBeenCalledWith(mockToken);
         expect(api.getOwnProfile).toHaveBeenCalled();
         
         const { calls } = dispatch.mock;
         // Check if fulfilled action was dispatched
         const [fulfilledCall] = calls.find(call => call[0].type === asyncLogin.fulfilled.type) || [];
         expect(fulfilledCall).toBeTruthy();
         expect(fulfilledCall.payload).toEqual({ token: mockToken, user: mockUser });
     });

     it('asyncLogin should dispatch rejected action on failure', async () => {
        api.login.mockRejectedValue(new Error('Login failed'));

        const dispatch = vi.fn();
        const getState = vi.fn();

        await asyncLogin({ email: 'test@test.com', password: '123' })(dispatch, getState, undefined);

        const { calls } = dispatch.mock;
        const [rejectedCall] = calls.find(call => call[0].type === asyncLogin.rejected.type) || [];
        expect(rejectedCall).toBeTruthy();
        expect(rejectedCall.payload).toBe('Login failed');
     });
  });
});
