import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { useSEOContent } from "../context/SEOContentContext";
import "./ThirdHero.css";

const ThirdHero = ({ content: contentProp }) => {
  const { content: contextContent } = useSEOContent();
  const [animationData, setAnimationData] = useState(null);

  // Use content from prop, context, or fallback to defaults
  const content = contentProp || contextContent;
  const greeting = content?.heroGreeting || '- Empower Your Workforce -';
  const titleLine1 = content?.heroTitleLine1 || 'Shape the Future of';
  const titleLine2 = content?.heroTitleLine2 || 'Your Organization Today';
  const subtitle = content?.heroSubtitle || 'Connect with top-tier talent across Canada and discover professionals who drive growth, innovation, and success for Canadian businesses.';
  const button1Text = content?.heroButton1Text || 'Book a Consultation';
  const button1Link = content?.heroButton1Link || '/book-call';
  const button2Text = content?.heroButton2Text || 'Our Services';
  const button2Link = content?.heroButton2Link || '/services';

  useEffect(() => {
    // Load the Lottie animation
    const loadLottieAnimation = async () => {
      try {
        const response = await fetch('/job-hunting.json');
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    };

    loadLottieAnimation();
  }, []);

  return (
    <section className="third-hero">
      <div className="third-hero__container">
        <div className="third-hero__content">
          <div className="third-hero__left">
            <div className="third-hero__greeting">{greeting}</div>
            <h1 className="third-hero__title">
              <span className="title-line-1">{titleLine1}</span>
              <span className="title-line-2">{titleLine2}</span>
            </h1>
            <p className="third-hero__subtitle">
              {subtitle}
            </p>
            
            <div className="third-hero__buttons">
              <Link to={button1Link} className="btn btn--primary-dark">
                {button1Text}
              </Link>
              <Link to={button2Link} className="btn btn--outline-dark">
                {button2Text}
              </Link>
            </div>
          </div>
          
          <div className="third-hero__right">
            <div className="lottie-container">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div className="lottie-placeholder">
                  <p>Loading animation...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdHero;
