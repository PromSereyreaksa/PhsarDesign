import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/Home/homepage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import BrowseJobs from "./pages/browse-job/page.jsx";
import PostJob from "./pages/post-job/page.jsx";
import Messages from "./pages/messages/page.jsx";
import Profile from "./pages/profile/page.jsx";
import Dashboard from "./pages/dashboard/page.jsx";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse-jobs" element={<BrowseJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
