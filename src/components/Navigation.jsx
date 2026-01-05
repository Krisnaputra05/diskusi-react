import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaComments, FaChartBar, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { asyncLogout } from '../features/auth/authSlice';

function Navigation() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(asyncLogout());
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-primary-600">
             <FaComments /> Diskusi
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary-600">Threads</Link>
          <Link to="/leaderboards" className="text-sm font-medium hover:text-primary-600 flex items-center gap-1">
             <FaChartBar /> Leaderboards
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.name} className="avatar-sm" />
              <span className="text-sm font-medium hidden md:block">{user.name}</span>
              <button type="button" onClick={onLogout} className="btn btn-outline text-sm" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost text-sm">
                 <FaSignInAlt className="mr-1"/> Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                 <FaUserPlus className="mr-1"/> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
