import "./MembersGrowth.css";

import member1 from "../../assets/member1.png";
import member2 from "../../assets/member2.png";
import member3 from "../../assets/member3.png";
import member4 from "../../assets/member4.png";
import member5 from "../../assets/member5.png";
import member6 from "../../assets/member6.png";

const images = [
  member1,
  member2,
  member3,
  member4,
  member5,
  member6,
];

const MembersGrowth = () => {
  return (
    <section className="members-growth">

      <div className="container">

        <h2 className="members-title">
          CHECK HOW <span>MOVIE CLIPS BUNDLE</span> HAS GROWN OUR MEMBERS PAGE
        </h2>

        <div className="members-grid">

          {images.map((img, index) => (
            <div className="member-card" key={index}>
              <img src={img} alt="" />
            </div>
          ))}

        </div>

        <h3 className="members-bottom-text">
          <span>6000+ Movie Clips Bundle</span> Will Help You To Generate More
          Followers, Views, Engagement & Revenue 💰
        </h3>

        <button className="members-btn">
          Who Is This <span>Movie Clips</span> For?
        </button>

      </div>

    </section>
  );
};

export default MembersGrowth;