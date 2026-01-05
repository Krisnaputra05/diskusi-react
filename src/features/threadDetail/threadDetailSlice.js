import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { asyncToggleUpVote, asyncToggleDownVote, asyncToggleNeutralVote } from '../threads/threadsSlice';

export const asyncReceiveThreadDetail = createAsyncThunk(
  'threadDetail/receive',
  async (threadId, { rejectWithValue }) => {
    try {
      const thread = await api.getThreadDetail(threadId);
      return thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAddComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const comment = await api.createComment({ threadId, content });
      return comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Comment mechanics
export const asyncToggleUpVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.upVoteComment({ threadId, commentId });
      return { threadId, commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncToggleDownVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.downVoteComment({ threadId, commentId });
      return { threadId, commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncToggleNeutralVoteComment = createAsyncThunk(
  'threadDetail/neutralVoteComment',
  async ({ threadId, commentId, userId }, { rejectWithValue }) => {
    try {
      await api.neutralVoteComment({ threadId, commentId });
      return { threadId, commentId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    detail: null,
    status: 'idle',
    error: null,
  },
  reducers: {
      clearThreadDetail: (state) => {
          state.detail = null;
          state.status = 'idle';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncReceiveThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.detail = null; 
        state.error = null;
      })
      .addCase(asyncReceiveThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(asyncReceiveThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(asyncAddComment.fulfilled, (state, action) => {
          if (state.detail) {
              state.detail.comments = [action.payload, ...state.detail.comments];
          }
      })

      // Handle Thread Votes (Optimistic UI for Thread Detail)
      .addCase(asyncToggleUpVote.pending, (state, action) => {
          const { threadId, userId } = action.meta.arg;
          if (state.detail && state.detail.id === threadId) {
             state.detail.downVotesBy = state.detail.downVotesBy.filter((id) => id !== userId);
             if (!state.detail.upVotesBy.includes(userId)) {
                 state.detail.upVotesBy.push(userId);
             }
          }
      })
       .addCase(asyncToggleDownVote.pending, (state, action) => {
          const { threadId, userId } = action.meta.arg;
          if (state.detail && state.detail.id === threadId) {
             state.detail.upVotesBy = state.detail.upVotesBy.filter((id) => id !== userId);
             if (!state.detail.downVotesBy.includes(userId)) {
                 state.detail.downVotesBy.push(userId);
             }
          }
      })
       .addCase(asyncToggleNeutralVote.pending, (state, action) => {
          const { threadId, userId } = action.meta.arg;
          if (state.detail && state.detail.id === threadId) {
             state.detail.upVotesBy = state.detail.upVotesBy.filter((id) => id !== userId);
             state.detail.downVotesBy = state.detail.downVotesBy.filter((id) => id !== userId);
          }
      })

      // Handle Comment Votes (Optimistic UI)
       .addCase(asyncToggleUpVoteComment.pending, (state, action) => {
           const { commentId, userId } = action.meta.arg;
           if (state.detail) {
               const comment = state.detail.comments.find((c) => c.id === commentId);
               if (comment) {
                  comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
                  if (!comment.upVotesBy.includes(userId)) {
                      comment.upVotesBy.push(userId);
                  }
               }
           }
       })
       .addCase(asyncToggleDownVoteComment.pending, (state, action) => {
           const { commentId, userId } = action.meta.arg;
           if (state.detail) {
               const comment = state.detail.comments.find((c) => c.id === commentId);
               if (comment) {
                  comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
                  if (!comment.downVotesBy.includes(userId)) {
                      comment.downVotesBy.push(userId);
                  }
               }
           }
       })
       .addCase(asyncToggleNeutralVoteComment.pending, (state, action) => {
           const { commentId, userId } = action.meta.arg;
           if (state.detail) {
               const comment = state.detail.comments.find((c) => c.id === commentId);
               if (comment) {
                  comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
                  comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
               }
           }
       })
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
