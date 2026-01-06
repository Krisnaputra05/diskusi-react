import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VoteButtons from './VoteButtons';

describe('VoteButtons Component', () => {
    const mockOnVote = vi.fn();
    
    it('renders vote counts correctly', () => {
        render(
            <VoteButtons 
               upVotesBy={['1', '2']}
               downVotesBy={['3']}
               authUser={{ id: '1', name: 'Me', avatar: 'x' }}
               onVote={mockOnVote}
            />
        );
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('handles up vote click', () => {
         const authUser = { id: '99', name: 'Me', avatar: 'x' };
         render(
            <VoteButtons 
               upVotesBy={[]}
               downVotesBy={[]}
               authUser={authUser}
               onVote={mockOnVote}
            />
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(mockOnVote).toHaveBeenCalledWith('up');
    });

    it('handles neutral vote click (toggle)', () => {
         // User already upvoted
         const authUser = { id: '99', name: 'Me', avatar: 'x' };
         render(
            <VoteButtons 
               upVotesBy={['99']}
               downVotesBy={[]}
               authUser={authUser}
               onVote={mockOnVote}
            />
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]); // Clicking up again
        expect(mockOnVote).toHaveBeenCalledWith('neutral');
    });

     it('alerts if not logged in', () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(
            <VoteButtons 
               upVotesBy={[]}
               downVotesBy={[]}
               authUser={null}
               onVote={mockOnVote}
            />
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(alertMock).toHaveBeenCalledWith('Please login to vote');
        alertMock.mockRestore();
    });
});
