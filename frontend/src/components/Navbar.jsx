import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          SocialHub
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          {user && <span className="text-gray-600">Hi, {user.username}!</span>}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
