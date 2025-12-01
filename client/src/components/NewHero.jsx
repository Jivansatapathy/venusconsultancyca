// client/src/components/NewHero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSEOContent } from "../context/SEOContentContext";
import "./NewHero.css";

// Vertical Slider Component (Desktop)
const VerticalSlider = ({ images, speed = 30, className = "" }) => {
  return (
    <div className={`new-hero-vertical-slider ${className}`}>
      <div className="new-hero-vertical-slider-track" style={{ animationDuration: `${speed}s` }}>
        {images.map((img, index) => (
          <div key={index} className="new-hero-vertical-slider-item">
            <img src={img} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
        {/* Duplicate images for seamless loop */}
        {images.map((img, index) => (
          <div key={`duplicate-${index}`} className="new-hero-vertical-slider-item">
            <img src={img} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile Slider Component (Horizontal)
const MobileSlider = ({ images, speed = 25 }) => {
  return (
    <div className="new-hero-mobile-slider-wrapper">
      <div className="new-hero-mobile-slider-track" style={{ animationDuration: `${speed}s` }}>
        {images.map((img, index) => (
          <div key={index} className="new-hero-mobile-slider-item">
            <img src={img} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
        {/* Duplicate images for seamless loop */}
        {images.map((img, index) => (
          <div key={`duplicate-${index}`} className="new-hero-mobile-slider-item">
            <img src={img} alt={`Gallery ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

const NewHero = () => {
  const { content } = useSEOContent();
  const heroContent = content?.home?.hero || {};

  // First slider with jobfair and gallery images (repeated and alternating)
  const slider1Images = [
    '/slider/jobfair.jpg',
    '/slider/jobfair2.jpg',
    '/slider/jobfair1.jpg',
    '/gallery/Team Venus at US thanks giving dinner at AMCHAM Gala Event.jpg',
    '/slider/jobfair.jpg',
    '/gallery/Venus Consultancy at Job-fair event.jpg'
  ];

  // Second slider with jobfair and gallery images (repeated and alternating)
  const slider2Images = [
    '/gallery/Team venus at Stellantis Headquarter Michigan.jpg',
    '/slider/jobfair1.jpg',
    '/gallery/Ontario Business Network Event with Venus Consultancy and Venus Global tech.jpg',
    '/slider/jobfair.jpg',
    '/gallery/Panel Discussion with teh TD Bank, Scotia Bank.jpg',
    '/slider/jobfair2.jpg',
    '/gallery/Venus Consultancy at HRPA.jpg',
    '/slider/jobfair1.jpg',
    '/gallery/Team Venus helping at Community Job fair.jpg',
    '/slider/jobfair2.jpg'
  ];

  // Mobile slider with Gallery images only (using confirmed existing images)
  const mobileSliderImages = [
    '/gallery/Great Meeting With the 22nd Prime Minister of Canada Stephen Harper.jpg',
    '/gallery/Great meeting with the Governor of the Bank of Canada, Tiff Macklem.jpg',
    '/gallery/Team Venus at US thanks giving dinner at AMCHAM Gala Event.jpg',
    '/gallery/Team venus at Stellantis Headquarter Michigan.jpg',
    '/gallery/Ontario Business Network Event with Venus Consultancy and Venus Global tech.jpg',
    '/gallery/Panel Discussion with teh TD Bank, Scotia Bank.jpg',
    '/gallery/Team Venus helping at Community Job fair.jpg',
    '/gallery/Venus Consultancy at Job-fair event.jpg',
    '/gallery/Venus Consultancy at Toronto Police Booth.jpg',
    '/gallery/Sharing the Pizza with Team.jpg'
  ];

  return (
    <section className="new-hero">
      <div className="new-hero-background"></div>
      
      <div className="new-hero-container">
        {/* Left Content */}
        <div className="new-hero-content">
          <h1 className="new-hero-title">
            {heroContent.title || "Beyond Solutions, We Build Success – Partnering in Your Growth Journey"}
          </h1>
          <p className="new-hero-subtitle">
            {heroContent.subtitle || "We unite Technology, Talent, and Opportunities to align your career goals with the perfect job match."}
          </p>
          <div className="new-hero-buttons">
            <Link 
              to={heroContent.button1Link || "/find-jobs"} 
              className="new-hero-btn-primary"
            >
              {heroContent.button1Text || "Find Works"}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link 
              to={heroContent.button2Link || "/contact"} 
              className="new-hero-btn-secondary"
            >
              {heroContent.button2Text || "Hire Talents Now"}
            </Link>
          </div>
        </div>

        {/* Right Side - Desktop Sliders */}
        <div className="new-hero-sliders">
          <VerticalSlider images={slider1Images} speed={25} className="new-hero-slider-1" />
          <VerticalSlider images={slider2Images} speed={30} className="new-hero-slider-2" />
        </div>

        {/* Mobile Slider */}
        <div className="new-hero-mobile-slider">
          <MobileSlider images={mobileSliderImages} speed={25} />
        </div>
      </div>
    </section>
  );
};

export default NewHero;

