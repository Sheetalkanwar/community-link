import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Communities from "./pages/Communities";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import CommunityDetails from "./pages/CommunityDetails";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Dashboard / Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Explore */}
        <Route
          path="/explore"
          element={<Explore />}
        />

        {/* Communities */}
        <Route
          path="/communities"
          element={<Communities />}
        />

        {/* Matches */}
        <Route
          path="/matches"
          element={<Matches />}
        />

        {/* Messages */}
        <Route
          path="/messages"
          element={<Messages />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Requests */}
        <Route
          path="/requests"
          element={<Requests />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />
        {/* Community Details */}
        <Route
  path="/communities/:communityId"
  element={<CommunityDetails />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;