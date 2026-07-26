import React from "react";
import "./Testimonial.css";

const testimonialsData = [
  {
    id: 1,
    rating: 5,
    text: "I have purchased 6000+ Movie clips 24 days back. I have got good results from this bundle i am very happy i have Earned ...",
    name: "Dhiraj kumar",
    location: "Noida",
    avatarIcon: "🤩",
  },
  {
    id: 2,
    rating: 4,
    text: "I have purchased this bundle for my page ( Amazing Videos) and i have just uploaded 12 clips and engagement is high...",
    name: "sushant sharma",
    location: "Jaipur",
    avatarIcon: "😁",
  },
  {
    id: 3,
    rating: 5,
    text: "before starting this work i dont have any knowledge but this bundle have all thing i have got tutorials and 4500 clips t...",
    name: "Vishal Dubey",
    location: "Lucknow",
    avatarIcon: "😎",
  },
  {
    id: 4,
    rating: 4,
    text: "I am Second Year Student this bundle is amazing i just have download the clips and just upload it on Facebook i have...",
    name: "Aryan Mahadick",
    location: "Pune",
    avatarIcon: "😎",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Testimonials</h2>
        <div className="testimonials-grid">
          {testimonialsData.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <div className="card-header">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < item.rating ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="quote-icon">“</div>
              </div>

              <p className="testimonial-text">{item.text}</p>

              <div className="card-footer">
                <span className="avatar-icon">{item.avatarIcon}</span>
                <span className="user-info">
                  {item.name} ({item.location})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
