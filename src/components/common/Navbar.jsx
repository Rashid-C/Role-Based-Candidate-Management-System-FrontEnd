import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                CMS
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/candidate/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Candidate Login
                </Link>
                <Link
                  to="/admin/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
