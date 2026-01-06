import { describe, it, expect, vi, beforeEach } from 'vitest';
import threadsReducer, { asyncAddThread, asyncPopulateThreads, asyncToggleUpVote } from './threadsSlice';
import api from '../../services/api';

vi.mock('../../services/api');

describe('threadsSlice', () => {
  describe('reducers', () => {
    it('should handle initial state', () => {
       const initialState = {
          entities: [],
          status: 'idle',
          error: null,
       };
       expect(threadsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should add thread when asyncAddThread.fulfilled', () => {
       const initialState = { entities: [] };
       const newThread = { id: '1', title: 'New Thread' };
       const action = { type: asyncAddThread.fulfilled.type, payload: newThread };
       const state = threadsReducer(initialState, action);
       expect(state.entities).toHaveLength(1);
       expect(state.entities[0]).toEqual(newThread);
    });
    
    it('should optimistically toggle upVote on pending', () => {
        const initialState = {
             entities: [
                 { id: '1', title: 'Thread 1', upVotesBy: [], downVotesBy: [] }
             ]
        };
        const action = {
             type: asyncToggleUpVote.pending.type,
             meta: { arg: { threadId: '1', userId: 'user-1' } }
        };
        const state = threadsReducer(initialState, action);
        expect(state.entities[0].upVotesBy).toContain('user-1');
    });

    it('should revert upVote on rejected', () => {
         const initialState = {
             entities: [
                 { id: '1', title: 'Thread 1', upVotesBy: ['user-1'], downVotesBy: [] }
             ]
        };
        const action = {
             type: asyncToggleUpVote.rejected.type,
             meta: { arg: { threadId: '1', userId: 'user-1' } },
             payload: 'Network Error'
        };
        const state = threadsReducer(initialState, action);
        expect(state.entities[0].upVotesBy).not.toContain('user-1'); 
    });
  });

  describe('thunks', () => {
       beforeEach(() => {
           vi.clearAllMocks();
       });

       it('asyncPopulateThreads success', async () => {
            const mockThreads = [{ id: '1' }, { id: '2' }];
            api.getAllThreads.mockResolvedValue(mockThreads);
            
            const dispatch = vi.fn();
            await asyncPopulateThreads()(dispatch, vi.fn(), undefined);

            const { calls } = dispatch.mock;
            const [fulfilled] = calls.find(c => c[0].type === asyncPopulateThreads.fulfilled.type) || [];
            
            expect(fulfilled).toBeTruthy();
            expect(fulfilled.payload).toEqual(mockThreads);
       });

       it('asyncAddThread success', async () => {
           const mockThread = { id: '3', title: 'Hello' };
           api.createThread.mockResolvedValue(mockThread);

           const dispatch = vi.fn();
           await asyncAddThread({ title: 'Hello', body: 'body', category: 'cat' })(dispatch, vi.fn(), undefined);

           expect(api.createThread).toHaveBeenCalledWith({ title: 'Hello', body: 'body', category: 'cat' });
           const { calls } = dispatch.mock;
           const [fulfilled] = calls.find(c => c[0].type === asyncAddThread.fulfilled.type) || [];
           expect(fulfilled.payload).toEqual(mockThread);
       });
  });
});
