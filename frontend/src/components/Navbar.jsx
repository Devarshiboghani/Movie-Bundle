import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { FiVideo, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-navbar sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-gradient-red fs-4" to="/">
          <FiVideo className="text-danger" /> MOVIE CLIPS BUNDLE
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-3 mt-3 mt-lg-0">
            {location.pathname === '/' && (
              <>
                <li className="nav-item">
                  <button className="btn nav-link border-0 text-white-50" onClick={() => handleScroll('highlights')}>
                    Highlights
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn nav-link border-0 text-white-50" onClick={() => handleScroll('contents')}>
                    Contents
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn nav-link border-0 text-white-50" onClick={() => handleScroll('pricing')}>
                    Pricing
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn nav-link border-0 text-white-50" onClick={() => handleScroll('faq')}>
                    FAQ
                  </button>
                </li>
              </>
            )}
            
            {admin ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-2" to="/admin">
                    <FiSettings /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm d-flex align-items-center gap-2" onClick={logout}>
                    <FiLogOut /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-white-50" to="/admin/login">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
