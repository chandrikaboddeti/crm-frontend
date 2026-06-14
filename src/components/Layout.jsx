import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext'; // ← ADD

const Layout = ({ children }) => {
  const { darkMode } = useTheme(); // ← ADD

  return (
    <div className="flex min-h-screen" style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #0f0c29 0%, #1a1535 50%, #0f0c29 100%)' // ← dark
        : 'linear-gradient(135deg, #f8f4ff 0%, #fdf2ff 50%, #f0f4ff 100%)' // ← light
    }}>
      <Sidebar />
      <div className="ml-60 flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;