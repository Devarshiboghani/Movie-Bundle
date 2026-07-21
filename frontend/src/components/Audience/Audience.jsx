import "./Audience.css";

import creator from "../../assets/creators.jpg";
import facebook from "../../assets/fbpage.png";
import youtuber from "../../assets/youtubers.jpg";
import influencer from "../../assets/influencers.jpg";

const audience = [
  {
    image: creator,
    title: "Content Creators",
    desc: "Content Creators who Running out of Idea or Who can easily post These and Go Viral Instantly.",
  },
  {
    image: facebook,
    title: "FB Page Owners",
    desc: "Facebook Admin of any Category who want High Engagement & New Followers Everyday.",
  },
  {
    image: youtuber,
    title: "YouTubers",
    desc: "Any Newbie YouTuber who is looking to start their YouTube Channel & Need Essential Tools.",
  },
  {
    image: influencer,
    title: "Influencers",
    desc: "Instagram & YouTube Influencers who wants to Build Crazy Social Media Following & Make Money.",
  },
];

export default function Audience() {
  return (
    <section className="audience-section">

      <div className="container">

        <div className="row gy-2 gx-lg-5">
        {/* <div className="row gx-lg-5"> */}
        {/* <div className="row gy-5 gx-lg-5"> */}

          {audience.map((item, index) => (

            <div className="col-lg-6" key={index}>

              <div className="audience-card">

                <img
                  src={item.image}
                  alt={item.title}
                  className="audience-image"
                />

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}