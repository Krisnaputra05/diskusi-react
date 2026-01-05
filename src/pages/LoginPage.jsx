import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncLogin } from '../features/auth/authSlice';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncLogin({ email, password }));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="container flex justify-center mt-10">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          {status === 'failed' && (
             <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account? <Link to="/register" className="text-primary-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
