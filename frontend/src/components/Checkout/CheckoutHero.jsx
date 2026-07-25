import "./CheckoutHero.css";

import logo from "../../assets/logo.png";
import bundleImage1 from "../../assets/checkImage2.png";
import bundleImage2 from "../../assets/checkImage2.png";

const CheckoutHero = () => {
  return (
    <section className="checkout-section">

      <div className="container-fluid checkout-container">

        <div className="row align-items-center justify-content-center">

          {/* LEFT SIDE */}

          <div className="col-lg-7 d-flex justify-content-center">

            <div className="left-section">

              {/* Logo */}

              <img
                src={logo}
                alt="Logo"
                className="checkout-logo"
              />

              {/* Heading */}

              <h2 className="checkout-title">
                6000+ Movie Clips Bundle
              </h2>

              {/* Product Image */}

              <img
                src={bundleImage1}
                alt="Movie Bundle"
                className="bundle-image"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-5 d-flex justify-content-center">

            <div className="checkout-card">

              <p className="email-text">
                Access to this purchase will be sent to this email
              </p>

              <input
                type="email"
                className="form-control checkout-input"
                placeholder="Email Address"
              />

              <div className="phone-box">

                <select className="form-select country-code">

                  <option>+91</option>

                </select>

                <input
                  type="text"
                  className="form-control phone-input"
                  placeholder="Add your phone number *"
                />

              </div>

              {/* Addon */}

              <div className="addon-box">

                <img
                  src={bundleImage2}
                  alt=""
                  className="addon-img"
                />

                <div>

                  <h4>
                    1000+ Facebook Auto Approval Groups
                  </h4>

                  <p>
                    1000+ Public Auto Approval Groups
                  </p>

                  <strong>
                    What You Will Get ?
                  </strong>

                  <p className="mt-2">
                    ✅ Movie Clips Auto Approved Groups ...
                  </p>

                  <h5>₹89</h5>

                  <button className="btn btn-dark mt-2">
                    ☐ Add to Order
                  </button>

                </div>

              </div>

              <div className="price-box">

                <div className="d-flex justify-content-between">

                  <span>Sub Total</span>

                  <span>

                    ₹149

                    <del className="ms-2">
                      ₹1,999
                    </del>

                  </span>

                </div>

                <div className="d-flex justify-content-between mt-3 fw-bold">

                  <span>Total</span>

                  <span>₹149</span>

                </div>

              </div>

              <button className="buy-btn">
                Buy Now →
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CheckoutHero;