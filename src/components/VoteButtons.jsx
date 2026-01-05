import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import PropTypes from 'prop-types';

function VoteButtons({ upVotesBy, downVotesBy, authUser, onVote }) {
  const isUpVoted = authUser && upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && downVotesBy.includes(authUser.id);

  const handleUpVote = (e) => {
    e.stopPropagation(); // Prevent bubbling if inside a clickable card
    if (!authUser) {
        alert('Please login to vote');
        return;
    }
    if (isUpVoted) {
      onVote('neutral');
    } else {
      onVote('up');
    }
  };

  const handleDownVote = (e) => {
    e.stopPropagation();
    if (!authUser) {
        alert('Please login to vote');
        return;
    }
    if (isDownVoted) {
      onVote('neutral');
    } else {
      onVote('down');
    }
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <button 
        type="button"
        onClick={handleUpVote}
        className={`flex items-center gap-1 text-sm ${isUpVoted ? 'text-primary-600 font-bold' : 'text-gray-500 hover:text-primary-600'}`}
      >
        <FaThumbsUp /> <span>{upVotesBy.length}</span>
      </button>
      <button 
        type="button"
        onClick={handleDownVote}
        className={`flex items-center gap-1 text-sm ${isDownVoted ? 'text-red-500 font-bold' : 'text-gray-500 hover:text-red-500'}`}
      >
        <FaThumbsDown /> <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

const userShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  avatar: PropTypes.string.isRequired,
};

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUser: PropTypes.shape(userShape),
  onVote: PropTypes.func.isRequired,
};

VoteButtons.defaultProps = {
    authUser: null,
};

export default VoteButtons;
