import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
    asyncReceiveThreadDetail, 
    asyncAddComment, 
    clearThreadDetail,
    asyncToggleUpVoteComment,
    asyncToggleDownVoteComment,
    asyncToggleNeutralVoteComment
} from '../features/threadDetail/threadDetailSlice';
import { asyncToggleUpVote, asyncToggleDownVote, asyncToggleNeutralVote } from '../features/threads/threadsSlice';
import VoteButtons from '../components/VoteButtons';
import { postedAt } from '../utils';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail: thread } = useSelector((state) => state.threadDetail);
  const { user: authUser } = useSelector((state) => state.auth);
  
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
     dispatch(asyncReceiveThreadDetail(id));
     return () => {
         dispatch(clearThreadDetail());
     };
  }, [dispatch, id]);

  const onThreadVote = (type) => {
      if (!authUser) {
          alert('Please login');
          return;
      }
      const data = { threadId: thread.id, userId: authUser.id };
      if (type === 'up') dispatch(asyncToggleUpVote(data));
      else if (type === 'down') dispatch(asyncToggleDownVote(data));
      else dispatch(asyncToggleNeutralVote(data));
  };

  const onCommentVote = (commentId, type) => {
      if (!authUser) {
          alert('Please login');
          return;
      }
      const data = { threadId: thread.id, commentId, userId: authUser.id };
      if (type === 'up') dispatch(asyncToggleUpVoteComment(data));
      else if (type === 'down') dispatch(asyncToggleDownVoteComment(data));
      else dispatch(asyncToggleNeutralVoteComment(data));
  }

  const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!authUser) {
          alert('Login first');
          return;
      }
      const result = await dispatch(asyncAddComment({ threadId: thread.id, content: commentContent }));
      if (!result.error) {
          setCommentContent('');
      } else {
          alert('Failed to post comment');
      }
  };

  if (!thread) {
      return <div className="text-center mt-10">Loading detail...</div>;
  }

  return (
    <div className="container max-w-3xl mx-auto mt-8 pb-10 px-4">
      
      {/* Thread Content */}
      <div className="card mb-8 p-6 sm:p-8 shadow-md border-gray-100">
        <div className="flex flex-col gap-6">
             {/* Header */}
             <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                     <img src={thread.owner.avatar} className="w-12 h-12 rounded-full border border-gray-100" alt={thread.owner.name} />
                     <div>
                         <div className="font-bold text-lg text-gray-900">{thread.owner.name}</div>
                         <div className="text-sm text-gray-500">{postedAt(thread.createdAt)}</div>
                     </div>
                 </div>
                 <span className="tag text-xs px-3 py-1">{thread.category}</span>
             </div>
             
             {/* Body */}
             <div>
                <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{thread.title}</h1>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {thread.body}
                </div>
             </div>

             {/* Footer Actions */}
             <div className="border-t pt-6 mt-2 flex items-center justify-between">
                 <VoteButtons 
                     upVotesBy={thread.upVotesBy}
                     downVotesBy={thread.downVotesBy}
                     authUser={authUser}
                     onVote={(type) => onThreadVote(type)}
                 />
                 <div className="text-gray-400 text-sm">
                    {thread.upVotesBy.length + thread.downVotesBy.length} votes
                 </div>
             </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mb-10">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              Comments <span className="bg-gray-200 text-gray-700 text-sm py-1 px-2 rounded-full">{thread.comments.length}</span>
          </h3>
          
          {authUser ? (
            <div className="card mb-8 p-6 bg-white shadow-sm border border-gray-200">
                <h4 className="text-sm font-bold mb-3 text-gray-700">Add to the discussion</h4>
                <form onSubmit={handleCommentSubmit}>
                    <textarea 
                        value={commentContent} 
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="input-field w-full h-32 mb-4 p-4 text-base focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-y"
                        placeholder="Type your comment here..."
                        required
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary px-6 py-2">Post Comment</button>
                    </div>
                </form>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">Log in to join the conversation.</p>
                <a href="/login" className="btn btn-primary">Login Now</a>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
              {thread.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                               <img src={comment.owner.avatar} className="w-10 h-10 rounded-full bg-gray-100" alt={comment.owner.name} />
                               <div>
                                   <span className="font-bold text-gray-900 block">{comment.owner.name}</span>
                                   <span className="text-xs text-gray-500">{postedAt(comment.createdAt)}</span>
                               </div>
                           </div>
                      </div>
                      <div className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line pl-12 border-l-2 border-gray-100 ml-1">
                          {comment.content}
                      </div>
                       <div className="pl-13 ml-1">
                           <VoteButtons 
                             upVotesBy={comment.upVotesBy}
                             downVotesBy={comment.downVotesBy}
                             authUser={authUser}
                             onVote={(type) => onCommentVote(comment.id, type)}
                         />
                       </div>
                  </div>
              ))}
              {thread.comments.length === 0 && (
                  <div className="text-center text-gray-500 py-10">
                      No comments yet. Be the first to share your thoughts!
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

export default DetailPage;
