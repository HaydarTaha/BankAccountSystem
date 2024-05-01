//App.jsx
import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import AccountList from "./pages/AccountList";
import { Logout } from "./service/AuthService";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  React.useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("user")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    const response = await Logout();
    // Delete the cookie if the response is successful
    if (response.status === 200) {
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoggedIn(false);
    }
  };

  const authenticatedRoutes = (
    <div>
      <Navbar handleLogout={handleLogout} />
      <section className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account-list" element={<AccountList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>
    </div>
  );

  const unauthenticatedRoutes = (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {loggedIn ? authenticatedRoutes : unauthenticatedRoutes}
      <Footer />
    </div>
  );
}

export default App;
