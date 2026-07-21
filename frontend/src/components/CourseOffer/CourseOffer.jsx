import React from 'react';
import './CourseOffer.css';

import facebookCourseImg from '../../assets/facebook-course.png'; 
import reelBundleImg from '../../assets/reel-bundle.png';
import youtubeCourseImg from '../../assets/youtube-course.png';

const CourseOffer = () => {
  const offerData = [
    {
      title: "Facebook Growth Mastery Course",
      description: "Ignite explosive Facebook growth. Master elite tactics to go viral. Transform your account with our Facebook Growth Mastery Course.",
      image: facebookCourseImg,
      alt: "Facebook Growth Mastery Course"
    },
    {
      title: "25,000+ Reel Bundle",
      description: "Get 25,000+ Reels Bundle in Bonuses For free covering all niche Instagram",
      image: reelBundleImg,
      alt: "25,000+ Reel Bundle"
    },
    {
      title: "Youtube Growth Mastery Course",
      description: "Explode your YouTube channel's growth. Master viral video creation, insider optimization tactics, influencer collaborations, and targeted promotion. Become a celebrated YouTube icon.",
      image: youtubeCourseImg,
      alt: "Youtube Growth Mastery Course"
    }
  ];

  return (
    <div className="offer-section">
      {/* Top Wave Background Effect */}
      <div className="wave-header">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z" fill="#ffffff"></path>
          <path d="M0,50 C300,10 600,90 900,40 C1200,0 1350,60 1440,30 L1440,0 L0,0 Z" fill="#ffffff" opacity="0.3"></path>
        </svg>
      </div>

      <div className="offer-content">
        {/* Header Text */}
        <p className="limited-offer">⏳ Limited Period Offer - Next Price Will be 499/- ⏳</p>
        <p className="unlock-bonus">Unlock Bonuses Worth ₹4,999/-</p>
        <h1 className="main-heading">If You Enroll Today!</h1>

        {/* Dynamic Cards Grid */}
        <div className="cards-container">
          {offerData.map((item, index) => (
            <div className="offer-card" key={index}>
              <div className="card-text">
                <h2>{item.title}</h2>
                <h5>{item.description}</h5>
              </div>
              <div className="card-image">
                <img src={item.image} alt={item.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseOffer;