// client/src/components/TransformSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./TransformSection.css";

const TransformSection = () => {
  return (
    <section className="transform-section">
      <div className="transform-grid">
        <div className="transform-content">
          <h2 className="transform-title">Ready to transform your talent strategy?</h2>
          <p className="transform-subtitle">
            Partner with Venus Hiring and unlock precision hiring across Canadian industries.
          </p>
          <div className="transform-ctas">
            <Link to="/contact" className="transform-btn-primary">
              Hire talent
            </Link>
            <Link to="/find-jobs" className="transform-btn-secondary">
              Find jobs
            </Link>
          </div>
        </div>
        <div className="transform-image-column">
          <div className="transform-image-wrapper">
            <img 
              src="/slider/transform.avif" 
              alt="Transform your talent strategy" 
              className="transform-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformSection;

