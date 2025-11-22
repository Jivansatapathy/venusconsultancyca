import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./StatAbout.css";

export default function StatAbout({ content }) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({ clients: 0, satisfaction: 0, success: 0 });

  // Use content from database or fallback to defaults
  const tag = content?.aboutTag || 'ABOUT VENUS HIRING';
  const title = content?.aboutTitle || 'Driving Success With An Expert Staffing';
  const description = content?.aboutDescription || 'At Venus Consultancy, we understand that the key to business success lies in having the right people on your team. As a leading Canadian recruitment firm based in Toronto, we\'re committed to connecting Canadian companies with exceptional talent across Canada. Our deep understanding of the Canadian job market, from Vancouver to Halifax, enables us to find the perfect match for businesses nationwide.';
  const statClients = content?.aboutStatClients || 77;
  const statSatisfaction = content?.aboutStatSatisfaction || 98;
  const statSuccess = content?.aboutStatSuccess || 99;
  const statClientsLabel = content?.aboutStatClientsLabel || 'Trusted Partnerships';
  const statSatisfactionLabel = content?.aboutStatSatisfactionLabel || 'Client Satisfaction';
  const statSuccessLabel = content?.aboutStatSuccessLabel || 'Success Rate';
  const ctaText = content?.aboutCtaText || 'JOIN OUR NETWORK';
  const ctaLink = content?.aboutCtaLink || '/book-call';

  // IntersectionObserver to detect when section comes into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Counter animation when in view
  useEffect(() => {
    if (!inView) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const targets = {
      clients: statClients,
      satisfaction: statSatisfaction,
      success: statSuccess
    };

    // Ease out cubic function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let rafId;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      setCounts({
        clients: Math.round(targets.clients * eased),
        satisfaction: Math.round(targets.satisfaction * eased),
        success: Math.round(targets.success * eased)
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView]);

  // Format number with suffix
  const formatStat = (value, suffix) => {
    if (suffix === 'K+') {
      return `${value}+`;
    }
    return `${value}${suffix}`;
  };

  return (
    <section className="stat-about" ref={sectionRef}>
      <div className="stat-about__container">
        {/* Left Side - Image Grid */}
        <div className="stat-about__left">
          <div className="stat-about__image-grid">
            {/* Top Left Image */}
            <div className="stat-about__image-item stat-about__image-item--1">
              <img 
                src="/images/imagetrail/image1.jpg" 
                alt="Team collaboration" 
                loading="lazy"
              />
            </div>
            
            {/* Top Right Image */}
            <div className="stat-about__image-item stat-about__image-item--2">
              <img 
                src="/images/imagetrail/image2.jpg" 
                alt="Team working together" 
                loading="lazy"
              />
            </div>
            
            {/* Bottom Left - Purple Card */}
            <div className="stat-about__image-item stat-about__image-item--card">
              <div className="stat-about__experience-card">
              <div className="stat-about__experience-number">18+</div>
              <div className="stat-about__experience-label">Years Of Experience</div>
              <div className="stat-about__team-avatars">
                <div className="stat-about__avatar">
                  <img src="/images/imagetrail/image1.jpg" alt="Team member" />
                </div>
                <div className="stat-about__avatar">
                  <img src="/images/imagetrail/image2.jpg" alt="Team member" />
                </div>
                <div className="stat-about__avatar">
                  <img src="/images/imagetrail/image3.jpg" alt="Team member" />
                </div>
                <div className="stat-about__avatar">
                  <img src="/images/imagetrail/image4.jpg" alt="Team member" />
                </div>
                <div className="stat-about__avatar stat-about__avatar--plus">+</div>
              </div>
              <div className="stat-about__team-text">We Are Awesome Team</div>
            </div>
            </div>
            
            {/* Bottom Right Image */}
            <div className="stat-about__image-item stat-about__image-item--3">
              <img 
                src="/images/imagetrail/image3.jpg" 
                alt="Professional team member" 
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="stat-about__right">
          {/* Tag */}
          <div className="stat-about__tag">
            <span className="stat-about__tag-icon">🏢</span>
            <span>{tag}</span>
          </div>

          {/* Title */}
          <h2 className="stat-about__title">
            {title}
          </h2>

          {/* Description */}
          <p className="stat-about__description">
            {description}
          </p>

          {/* Stats */}
          <div className="stat-about__stats">
            <div className="stat-about__stat">
              <div className="stat-about__stat-number">
                {formatStat(counts.clients, 'K+')}
              </div>
              <div className="stat-about__stat-label">{statClientsLabel}</div>
            </div>
            <div className="stat-about__stat">
              <div className="stat-about__stat-number">
                {formatStat(counts.satisfaction, '%')}
              </div>
              <div className="stat-about__stat-label">{statSatisfactionLabel}</div>
            </div>
            <div className="stat-about__stat">
              <div className="stat-about__stat-number">
                {formatStat(counts.success, '%')}
              </div>
              <div className="stat-about__stat-label">{statSuccessLabel}</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link to={ctaLink} className="stat-about__cta">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}

