import "./CustomerReviews.css";

import review1 from "../../assets/review1.jpg";
import review2 from "../../assets/review2.jpg";
import review3 from "../../assets/review3.png";
import review4 from "../../assets/review4.jpg";
import review5 from "../../assets/review5.png";
import review6 from "../../assets/review4.jpg";

const reviews = [
  review1,
  review2,
  review3,
  review4,
  review5,
  review6,
];

const CustomerReviews = () => {
  return (
    <section className="customer-review-section">

      <h2 className="review-heading">
        Customer Reviews
      </h2>

      <div className="review-grid">

        {reviews.map((img, index) => (
          <div className="review-card" key={index}>
            <img src={img} alt={`Review ${index + 1}`} />
          </div>
        ))}

      </div>

      <button className="buy-btn">
        Buy Now At Just ₹149/-
      </button>

      <div className="review-benefits">

        <p>100% Copyright Free</p>

        <p>Direct Upload Without Editing</p>

        <p>Free Bonuses Of ₹5,000</p>

        <p>Instant Access On Whatsapp</p>

      </div>

      <div className="timer">

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

    </section>
  );
};

export default CustomerReviews;