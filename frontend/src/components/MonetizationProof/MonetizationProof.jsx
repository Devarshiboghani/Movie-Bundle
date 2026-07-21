import "./MonetizationProof.css";

import Monetization1 from "../../assets/Monetization1.png";
import Monetization2 from "../../assets/Monetization2.png";
import Monetization3 from "../../assets/Monetization3.png";
import Monetization4 from "../../assets/Monetization4.png";

const MonetizationProof = () => {
  return (
    <section className="monetization-proof">
      <div className="container">
        <h2 className="proof-title">
          MOVIE CLIPS <span>PAGE MONETIZATION</span> PROOF
        </h2>

        <div className="proof-grid">
          <div className="proof-card">
            <img src={Monetization1} alt="" />
          </div>

          <div className="proof-card">
            <img src={Monetization2} alt="" />
          </div>

          <div className="proof-card">
            <img src={Monetization3} alt="" />
          </div>

          <div className="proof-card">
            <img src={Monetization4} alt="" />
          </div>
        </div>

        <div className="proof-bottom-bar">
          इनका ताजा आप Daily 2-3 क्लिप्स अपलोड करें और Page मॉनिटाइज करें!
        </div>

        <ul className="proof-list">
          <li>✔ Full Monetization Support</li>
{/* 
          <li>✔ Copyright Free Movie Clips</li>

          <li>✔ Viral Ready Content</li>

          <li>✔ Instant Download</li> */}
        </ul>
      </div>
    </section>
  );
};

export default MonetizationProof;
