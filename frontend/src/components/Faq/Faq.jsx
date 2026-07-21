import { useState } from "react";
import "./Faq.css";

const faqData = [
  {
    question: "When Will I Receive My Product?",
    answer:
      "You will be sent automatically to the download page after payment. Product will also be given on the Whatsapp that you have provided on payment page. If You Dont Receive the bundle whatsapp Us +91 7977159306 With your payment Screenshot and email ID",
  },
  {
    question: "What If I Don't Receive My Product?",
    answer:
      "We have never faced this issue till now, just send us an Whatsapp Msg at +91 7977159306 with your order details and we will send you a new one.",
  },
  {
    question: "Will I Get Access To The Product?",
    answer:
      "Yes. You will get Lifetime Access immediately after your purchase.",
  },
  {
    question: "How Can I Monetize My Page ?",
    answer:
      "Upload clips regularly with proper titles and hashtags and follow Facebook Monetization policies.",
  },
  {
    question: "Clips Are Copyright Free ?",
    answer:
      "Yes. The clips included in this bundle are ready to upload as mentioned in the bundle details.",
  },
];

const Faq = () => {
  const [active, setActive] = useState([]);

  const toggle = (index) => {
    if (active.includes(index)) {
      setActive(active.filter((item) => item !== index));
    } else {
      setActive([...active, index]);
    }
  };

  return (
    <section className="faq-section">
      <div className="container-fluid">
        <h2 className="faq-title">
          FAQ <span>[Frequently Asked Question]</span>
        </h2>

        <div className="faq-wrapper">
          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <button
                className="faq-question"
                onClick={() => toggle(index)}
              >
                {item.question}

                <span
                  className={
                    active.includes(index) ? "arrow rotate" : "arrow"
                  }
                >
                  ▶
                </span>
              </button>

              <div
                className={
                  active.includes(index)
                    ? "faq-answer active"
                    : "faq-answer"
                }
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;