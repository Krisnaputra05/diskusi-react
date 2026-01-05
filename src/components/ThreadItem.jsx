import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';
import { postedAt } from '../utils';
import VoteButtons from './VoteButtons';

function ThreadItem({ thread, author, authUser, onVote }) {
  const navigate = useNavigate();
  
  const onNavigate = () => {
      navigate(`/threads/${thread.id}`);
  };

  // Strip HTML for summary
  const summary = `${thread.body.replace(/<[^>]+>/g, '').substring(0, 150)}...`;

  return (
    <div className="card cursor-pointer hover:bg-gray-50 p-5 transition-all" onClick={onNavigate}>
      {/* Header: Author & Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
             <img 
               src={author ? author.avatar : 'https://ui-avatars.com/api/?name=?'} 
               alt={author ? author.name : 'Unknown'} 
               className="w-8 h-8 rounded-full border border-gray-100" 
             />
             <div className="flex flex-col">
                 <span className="text-sm font-semibold text-gray-900">{author ? author.name : 'Unknown User'}</span>
                  <span className="text-xs text-gray-400">{postedAt(thread.createdAt)}</span>
             </div>
        </div>
        <span className="tag text-[10px] px-2 py-0.5">{thread.category}</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-primary-600 transition-colors leading-tight">
        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {summary}
      </p>

      {/* Footer: Interactions */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-50">
           <VoteButtons 
                upVotesBy={thread.upVotesBy}
                downVotesBy={thread.downVotesBy}
                authUser={authUser}
                onVote={(type) => onVote(thread.id, type)}
           />
           <div className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-primary-600 transition-colors">
               <FaRegComment /> 
               <span className="font-medium">{thread.totalComments}</span>
               <span className="hidden sm:inline">Comments</span>
           </div>
      </div>
    </div>
  );
}

const userShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  avatar: PropTypes.string.isRequired,
};

const threadShape = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    ownerId: PropTypes.string,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalComments: PropTypes.number.isRequired,
};

ThreadItem.propTypes = {
  thread: PropTypes.shape(threadShape).isRequired,
  author: PropTypes.shape(userShape),
  authUser: PropTypes.shape(userShape),
  onVote: PropTypes.func.isRequired,
};

ThreadItem.defaultProps = {
    author: null,
    authUser: null,
};

export default ThreadItem;
