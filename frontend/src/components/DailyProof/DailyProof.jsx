import "./DailyProof.css";
import dailyproofImage from "../../assets/dailyproof.png";

const DailyProof = () => {
  return (
    <section className="daily-proof">

      <div className="proof-top-bar">
        <h2>
          2025 की सारी Latest Movie Clips जैसे की
          <span> Pushpa 2, Chhaava, Dhurandhar & South Movies </span>
          हमारे बंडल में मिलेगा
        </h2>
      </div>

      <div className="container">

        <h1 className="proof-heading">
          GET <span>MOVIE CLIPS</span> DAILY PROOF
        </h1>

<div className='proof-single-image'>
          <img
            src={dailyproofImage}
            alt='Daily Movie Clips Proof'
          />
        </div>
      </div>

    </section>
  );
};

export default DailyProof;