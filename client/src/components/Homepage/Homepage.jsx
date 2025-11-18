import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Homepage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect authenticated users to the dashboard
      navigate('/app');
    } else {
      // Redirect unauthenticated users to login
      navigate('/login');
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Logout if authenticated
      logout();
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 flex-wrap">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          DesignPro
        </div>
        <div className="flex space-x-4 flex-wrap gap-2 mt-2 md:mt-0">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors btn-responsive"
          >
            Home
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/app')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors btn-responsive touch-device-button"
              >
                Canvas
              </button>
              <button
                onClick={handleAuthAction}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors btn-responsive touch-device-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors btn-responsive touch-device-button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors btn-responsive touch-device-button"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">DesignPro</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10">
          Create stunning designs, collaborate in real-time, and bring your ideas to life with our powerful yet intuitive design tool.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-200 btn-responsive touch-device-button"
        >
          Get Started
        </button>
        
        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl w-full">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
            <div className="text-indigo-600 text-2xl mb-4">✏️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Intuitive Drawing</h3>
            <p className="text-gray-600 text-sm sm:text-base">Create beautiful sketches with our easy-to-use drawing tools.</p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
            <div className="text-indigo-600 text-2xl mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-gray-600 text-sm sm:text-base">Work together with your team in real-time on the same canvas.</p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
            <div className="text-indigo-600 text-2xl mb-4">💾</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Cloud Storage</h3>
            <p className="text-gray-600 text-sm sm:text-base">Save your work securely in the cloud and access it from anywhere.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
        <p>© {new Date().getFullYear()} DesignPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;