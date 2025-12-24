import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = ({ setLogin }) => {
  const navigate = useNavigate();
  const { getTotalCartItems, signin, setSignin, setToken } =
    useContext(StoreContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* 🔍 SEARCH STATES */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Smooth scroll
  const scrollToSection = (targetId) => {
    navigate("/");
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setSignin(false);
    toast.success("Logout Successful");
    navigate("/");
  };

  /* 🔍 DEBOUNCED SEARCH EFFECT */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/search?q=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      {/* Navigation */}
      <ul className={`nav-items ${isMenuOpen ? "show-menu" : ""}`}>
        <li onClick={() => scrollToSection("top")}>Home</li>
        <li onClick={() => scrollToSection("menu")}>Menu</li>
        <li onClick={() => scrollToSection("contact")}>Contact Us</li>
        <li onClick={() => scrollToSection("mobile-app")}>Mobile App</li>
      </ul>

      {/* Right Section */}
      <div className="nav-right">
        {/* 🔍 SEARCH BAR */}
        <div className="main-search">
          <input
            type="text"
            placeholder="Search for restaurant or dish..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Loading */}
          {loading && (
            <div className="search-dropdown">
              <p className="search-loading">Searching...</p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="search-item"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    navigate(`/food/${item._id}`);
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="search-name">{item.name}</p>
                    <span className="search-price">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="search-dropdown">
              <p className="no-results">No results found</p>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="cart-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" className="nav-icon" />
          </Link>
          {getTotalCartItems() > 0 && (
            <div className="dot">{getTotalCartItems()}</div>
          )}
        </div>

        {/* Auth */}
        {signin ? (
          <div className="profile-container">
            <img
              src={assets.profile_icon}
              alt="user"
              className="nav-icon"
              onClick={() => setShowProfileMenu((p) => !p)}
            />
            {showProfileMenu && (
              <div className="profile-dropdown">
                <p
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/orders");
                  }}
                >
                  My Orders
                </p>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-in" onClick={() => setLogin(true)}>
            Sign in
          </button>
        )}

        {/* Mobile Menu */}
        <div
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen((p) => !p)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
