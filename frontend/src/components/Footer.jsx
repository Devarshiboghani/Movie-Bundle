import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-top border-secondary py-5 mt-auto" style={{ backgroundColor: 'rgba(11,15,25,0.95)' }}>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
            <Link className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 fw-bold text-gradient-primary fs-5 mb-2 text-decoration-none" to="/">
              <FiCpu className="text-primary" /> BUNDLE.IO
            </Link>
            <p className="text-white-50 small mb-0">
              Deliver premium eBooks and resource toolkits instantly to developers and creators worldwide.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-4 mb-3">
              <Link className="text-white-50 text-decoration-none small hover-white" to="/">Landing</Link>
              <Link className="text-white-50 text-decoration-none small hover-white" to="/admin/login">Admin Access</Link>
              <a className="text-white-50 text-decoration-none small hover-white" href="#pricing">Purchase</a>
            </div>
            <p className="text-white-50 small mb-0">
              &copy; {new Date().getFullYear()} BUNDLE.IO. All rights reserved. Secure transactions powered by Stripe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
