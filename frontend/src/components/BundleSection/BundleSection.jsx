import "./BundleSection.css";
import bundle from "../../assets/movie.png";
import { FaCheckCircle } from "react-icons/fa";

const features = [
  "Hindi Movie Clips (2025/2026)",
  "South Dubbed Movie Clips",
  "Action Movie Clips",
  "Old 90s Movie Clips",
  "Romantic Movie Clips",
  "Horror Movie Clips",
  "Web Series Clips",
  "1000+ Pre Made Video Titles (English & Hindi)",
  "1000+ Viral Facebook Hashtags (2026)",
  "Facebook Viral Course A to Z (2025/2026)",
  "Best For Beginner with Step-by-Step Guide",
];

const BundleSection = () => {
  return (
    <section className="bundle-section">
      <div className="container">
        <div className="row align-items-start">
          <div className="col-lg-5 bundle-left">
            <img src={bundle} className="bundle-image img-fluid" alt="" />
          </div>

          <div className="col-lg-7">
            <h2 className="bundle-title">Everything Included In Your Bundle</h2>

            {/* <p className="bundle-subtitle">
              Premium ready-to-use movie collection with lifetime updates.
            </p> */}

            <div className="feature-list">
              {features.map((item, index) => (
                <div className="feature-item" key={index}>
                  <FaCheckCircle className="check" />
                  {item}
                </div>
              ))}
            </div>
          </div>
            </div>
      </div>

          {/* <div className="bundle-bottom"> */}
          <button className="buy-btn1">Buy Now At Just ₹149/-</button>

          <div className="extra-benefits">
            <p>100% Copyright Free</p>
            <p>Direct Upload Without Editing</p>
            <p>100% Replacement Of Clips</p>
            <p>Free Bonuses Of ₹5,000</p>
          </div>

          <div className="timer1">
            <div>
              <h3>00</h3>
              <span>Hours</span>
            </div>

            <div>
              <h3>00</h3>
              <span>Minutes</span>
            </div>

            <div>
              <h3>00</h3>
              <span>Seconds</span>
            </div>
          </div>

          {/* <div>
                  <span>✔</span>100% Copyright Free
                </div>
                <div>
                  <span>✔</span>Direct Upload Without Editing
                </div>
                <div>
                  <span>✔</span>100% Replacement Of Clips
                </div>
                <div>
                  <span>✔</span>Free Bonuses Of ₹5,000
                </div> */}
        {/* </div>
      </div> */}
      {/* </div> */}
      {/* </div> */}
    </section>
  );
};

export default BundleSection;
