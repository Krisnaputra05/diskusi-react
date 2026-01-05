import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPopulateThreads, asyncAddThread, asyncToggleUpVote, asyncToggleDownVote, asyncToggleNeutralVote } from '../features/threads/threadsSlice';
import { asyncPopulateUsers } from '../features/users/usersSlice';
import ThreadItem from '../components/ThreadItem';

function HomePage() {
  const dispatch = useDispatch();
  const { entities: threads, status: threadStatus } = useSelector((state) => state.threads);
  const { list: users } = useSelector((state) => state.users);
  const { user: authUser } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  
  // Create Thread State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(asyncPopulateUsers());
    dispatch(asyncPopulateThreads());
  }, [dispatch]);

  const onVote = (threadId, type) => {
      if (!authUser) {
          alert('Please login');
          return;
      }
      const data = { threadId, userId: authUser.id };
      if (type === 'up') dispatch(asyncToggleUpVote(data));
      else if (type === 'down') dispatch(asyncToggleDownVote(data));
      else dispatch(asyncToggleNeutralVote(data));
  };

  const categories = [...new Set(threads.map((t) => t.category))];

  const filteredThreads = filter 
    ? threads.filter((t) => t.category === filter)
    : threads;

  const handleCreateThread = async (e) => {
      e.preventDefault();
      if (!authUser) {
        alert('Login first');
        return;
      }
      const result = await dispatch(asyncAddThread({ title, body, category }));
      if (!result.error) {
          setShowCreate(false);
          setTitle('');
          setBody('');
          setCategory('');
      } else {
          alert(result.payload || 'Failed to create thread');
      }
  };

  if (threadStatus === 'loading' && threads.length === 0) {
      return <div className="text-center mt-10">Loading threads...</div>;
  }

  return (
    <div className="container max-w-5xl mx-auto mt-8 pb-10 px-4">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Discussions</h1>
           <button 
             type="button"
             onClick={() => setShowCreate(!showCreate)} 
             className="btn btn-primary"
            >
               {showCreate ? 'Close' : 'New Discussion'}
           </button>
      </div>

      {/* Create Form */}
      {showCreate && (
          <div className="card mb-8 animate-fade-in">
              <h2 className="text-xl mb-4">Create New Discussion</h2>
              <form onSubmit={handleCreateThread}>
                  <div className="input-group">
                      <input 
                         placeholder="Title" 
                         value={title} 
                         onChange={(e) => setTitle(e.target.value)} 
                         className="input-field" 
                         required
                      />
                  </div>
                  <div className="input-group">
                      <input 
                         placeholder="Category (Optional)" 
                         value={category} 
                         onChange={(e) => setCategory(e.target.value)} 
                         className="input-field" 
                      />
                  </div>
                  <div className="input-group">
                      <textarea 
                         placeholder="What's on your mind?" 
                         value={body} 
                         onChange={(e) => setBody(e.target.value)} 
                         className="input-field h-32" 
                         required
                      />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Post</button>
              </form>
          </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
          <button 
             type="button"
             className={`tag cursor-pointer ${filter === '' ? 'bg-primary-600 text-white border-transparent' : 'bg-white text-primary-600'}`}
             onClick={() => setFilter('')}
          >
              #All
          </button>
          {categories.map((cat) => (
             <button 
                type="button"
                key={cat} 
                className={`tag cursor-pointer ${filter === cat ? 'bg-primary-600 text-white border-transparent' : 'bg-white text-primary-600'}`}
                onClick={() => setFilter(cat)}
            >
                 #{cat}
             </button>
          ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
          {filteredThreads.map((thread) => {
              const author = users.find((u) => u.id === thread.ownerId);
              return (
                  <ThreadItem 
                      key={thread.id} 
                      thread={thread} 
                      author={author} 
                      authUser={authUser}
                      onVote={onVote}
                  />
              );
          })}
          {filteredThreads.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                  No discussions found.
              </div>
          )}
      </div>
    </div>
  );
}

export default HomePage;
