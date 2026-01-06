import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ThreadItem from './ThreadItem';

describe('ThreadItem Component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'This is a test body content that is long enough.',
    category: 'General',
    createdAt: '2023-01-01T00:00:00.000Z',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 5
  };

  const mockAuthor = {
    id: 'user-1',
    name: 'Author Name',
    avatar: 'https://ui-avatars.com/api/?name=Author',
  };

  const mockOnVote = vi.fn();

  it('renders thread content correctly', () => {
    render(
       <MemoryRouter>
           <ThreadItem 
              thread={mockThread} 
              author={mockAuthor} 
              authUser={null} 
              onVote={mockOnVote} 
           />
       </MemoryRouter>
    );

    expect(screen.getByText('Test Thread')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Author Name')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Comments
  });
  
  it('calls onVote when vote buttons are clicked', () => {
      // Need authenticated user to vote
      const authUser = { id: 'user-2', name: 'Voter', avatar: 'x' };
      
      render(
       <MemoryRouter>
           <ThreadItem 
              thread={mockThread} 
              author={mockAuthor} 
              authUser={authUser} 
              onVote={mockOnVote} 
           />
       </MemoryRouter>
    );
     // VoteButtons component is integrated. We look for buttons inside it.
     // Usually VoteButtons has aria-label or we find by icon/class. 
     // Checking VoteButtons.jsx: it renders buttons with FaThumbsUp/Down.
     // No aria-labels defined in VoteButtons.jsx (opportunity for improvement, but I will query by role button for now or text).
     // Text inside buttons is count: 0.
     
     const buttons = screen.getAllByRole('button');
     // first button is Up, second is Down. Logic in VoteButtons.jsx
     
     fireEvent.click(buttons[0]); // UpVote
     expect(mockOnVote).toHaveBeenCalledWith('thread-1', 'up');

     fireEvent.click(buttons[1]); // DownVote
     expect(mockOnVote).toHaveBeenCalledWith('thread-1', 'down');
  });
});
