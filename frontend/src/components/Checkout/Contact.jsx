import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [showTerms, setShowTerms] = useState(false);

  const toggleTerms = () => {
    setShowTerms(!showTerms);
  };

  return (
    <footer className="contact-section">
      <div className="contact-container">
        
        {/* Contact Section */}
        <div className="contact-box">
          <h3 className="contact-title">Contact Amex Digital</h3>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <span className="contact-text">support@digibundleshopz.online</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span className="contact-text">+91 7977159306</span>
          </div>
        </div>

        {/* Terms and Conditions Section */}
        <div className="terms-box">
          <div className="terms-header" onClick={toggleTerms}>
            <span className="terms-toggle-icon">{showTerms ? "−" : "+"}</span>
            <h4 className="terms-title">Terms and conditions</h4>
          </div>
          {showTerms && (
            <p className="terms-text">
              You agree to share information entered on this page with Amex
              Digital (owner of this page) and Cosmofeed, adhering to applicable
              laws.
            </p>
          )}
        </div>

        <div className="footer-divider"></div>

        {/* SuperProfile Branding Section */}
        <div className="superprofile-box">
          <div className="superprofile-brand">
            <span className="superprofile-logo">⚡</span>
            <span className="superprofile-name">SuperProfile</span>
          </div>
          <p className="superprofile-text">
            Want to create your own payment page? Experience hassle-free payouts
            and premium support. Get started now!
          </p>
        </div>
      </div>
    </footer>
  );
}
