import React, { useState } from "react";
import "./CheckoutFaq.css";

const faqData = [
  {
    id: 1,
    question: "How Can I access Bundle ?",
    answer:
      "After Successfull Payment you will get access to all clips and bonuses, If you dont get it Whatsapp Us we will help you",
  },
  {
    id: 2,
    question: "I Am beginner How Can I start ?",
    answer:
      "With The 1000+ Clips you will get tutorials and you will learn how to work on page, upload, edit , analysis and Earn money",
  },
  {
    id: 3,
    question: "Who Can Buy This Bundle ?",
    answer:
      "All who are interested in online earning and want side income this bundle will get you all this by working 1-2 hrs",
  },
  {
    id: 4,
    question: "Can we also earn money by uploading videos on Facebook?",
    answer:
      "Yes, you will be taught step by step in our bundle. How can you also earn money by uploading movie clips or other videos on Facebook?",
  },
  {
    id: 5,
    question: "How Can I contact You ?",
    answer: "You Can contact us on whatsapp +91 7977159306",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="checkoutfaq-section">
      <div className="checkoutfaq-container">
        <h2 className="checkoutfaq-title">Frequently Asked Questions (FAQs)</h2>
        <div className="checkoutfaq-list">
          {faqData.map((item) => (
            <div
              className={`checkoutfaq-card ${openId === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => toggleFAQ(item.id)}
            >
              <div className="checkoutfaq-question">
                <span>{item.question}</span>
                <span className="checkoutfaq-icon">
                  {openId === item.id ? "−" : "+"}
                </span>
              </div>
              {openId === item.id && (
                <div className="checkoutfaq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
