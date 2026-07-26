import { useState } from "react";
import "./CheckoutHero.css";
import logo from "../../assets/logo.png";
import bundleImage1 from "../../assets/checkImage1.png";
import bundleImage2 from "../../assets/checkImage2.png";

const CheckoutHero = () => {
  const [addOn, setAddOn] = useState(false);

  const basePrice = 149;
  const addOnPrice = 89;

  const total = addOn ? basePrice + addOnPrice : basePrice;

  return (
    <section className="checkout-section">
      <div className="container-fluid checkout-container">
        <div className="row align-items-center g-0">

          {/* LEFT SIDE */}
          <div className="col-lg-7 col-xl-7 d-flex justify-content-end">
            <div className="left-section">
              <img src={logo} alt="Logo" className="checkout-logo" />

              <h2 className="checkout-title">6000+ Movie Clips Bundle</h2>

              <img
                src={bundleImage1}
                alt="Movie Bundle"
                className="bundle-image"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-5 col-xl-5 d-flex justify-content-start">
            <div className="checkout-card">
              <p className="email-text">
                Access to this purchase will be sent to this email
              </p>

              <input
                type="email"
                className="form-control checkout-input"
                placeholder="Email Address"
              />

              <div className="phone-wrapper">
                <div className="country-select-wrapper">
                  <select className="country-select">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <span className="dropdown-icon">⌄</span>
                </div>

                <input
                  type="tel"
                  className="phone-field phone-input"
                  placeholder="Add your phone number *"
                />
              </div>

              <div className="blue">
                <div className="addon-box">
                  <img src={bundleImage2} alt="" className="addon-img" />
                  <h4>1000+ Facebook Auto Approval Groups</h4>
                </div>
                <p>1000+ Public Auto Approval Groups</p>

                <strong>What You Will Get ?</strong>

                <p className="mt-2 gray">
                  ✅ Movie Clips Auto Approved Groups ...
                </p>

                <h5>₹89</h5>

                <label className="add-order-btn">
                  <input
                    type="checkbox"
                    className="order-checkbox"
                    checked={addOn}
                    onChange={() => setAddOn(!addOn)}
                  />

                  <span className="checkmark"></span>
                  <span className="btn-text">Add to Order</span>
                </label>
              </div>

              <div className="price-box">
                <div className="price-row">
                  <span className="label">Sub Total</span>

                  <div className="price-right">
                    <span className="price">₹{basePrice}</span>
                    <del>₹1,999</del>
                  </div>
                </div>

                {addOn && (
                  <div className="price-row">
                    <span>Add On</span>
                    <span className="price">₹{addOnPrice}</span>
                  </div>
                )}

                <div className="price-row total-row">
                  <span className="label">Total</span>
                  <span className="price">₹{total}</span>
                </div>
              </div>

              <button className="buy-btn">
                <span>Buy Now</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutHero;
