import React from 'react';
import './UploadSection.css';

// Apni offline images ko sahi relative path se import karein
import instagramImg from '../../assets/instagram.png'; 
import youtubeImg from '../../assets/youtube.png';
import facebookImg from '../../assets/facebook.png';

const UploadSection = () => {
  return (
    <div className="upload-container">
      <h2 className="upload-title">Where can I Upload these Movie Clips ?</h2>
      
      <div className="icon-group">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon-card">
          <img src={instagramImg} alt="Instagram" />
        </a>
        
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="icon-card">
          <img src={youtubeImg} alt="YouTube" />
        </a>
        
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon-card">
          <img src={facebookImg} alt="Facebook" />
        </a>
      </div>
    </div>
  );
};

export default UploadSection;