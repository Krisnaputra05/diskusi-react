import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncRegister } from '../features/auth/authSlice';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // We can use a separate status for register if we want, or just generic loading state
  // But usually register is fire-and-forget or redirects to login. 
  // The API doesn't auto-login after register usually.
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    
    const result = await dispatch(asyncRegister({ name, email, password }));
    setIsLoading(false);
    
    if (!result.error) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setLocalError(result.payload);
    }
  };

  return (
    <div className="container flex justify-center mt-10">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <div className="input-group">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          
          {localError && (
             <div className="text-red-500 text-sm text-center">{localError}</div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
         <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-primary-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
