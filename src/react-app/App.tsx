import { useState } from "react"; // 👈 New: Import useState
import { Menu, X } from 'lucide-react'; // 👈 New: Import icons for the toggle button
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import SearchPage from "@/react-app/pages/Search";
import LeaderboardPage from "@/react-app/pages/Leaderboard";
import ComparePage from "@/react-app/pages/Compare";
import DiscoveryPage from "@/react-app/pages/Discovery";
import Navigation from "@/react-app/components/Navigation";
import { FrameInit } from "@/react-app/components/FrameInit";

export default function App() {
  // 1. Define state to control menu visibility (default to true/visible)
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  // 2. Define the toggle function
  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  return (
    <Router>
      {/* 3. Add the toggle button */}
      <button 
        onClick={toggleMenu}
        // Tailwind classes to position the button (adjust top/left as needed)
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg transition-transform duration-300 md:hidden"
      >
        {isMenuVisible ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
      </button>

      <div className="flex">
        {/* 4. Pass the visibility state to Navigation */}
        <Navigation isVisible={isMenuVisible} toggleMenu={toggleMenu} /> 

        <div 
          className="flex-1 transition-all duration-300 p-4 md:p-8"
          // Adjust content margin to account for the menu width (w-64 = 16rem)
          style={{ marginLeft: isMenuVisible ? '16rem' : '0' }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
          </Routes>
        </div>
        <FrameInit />
      </div>
    </Router>
  );
}