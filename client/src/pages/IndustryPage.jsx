// client/src/pages/IndustryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getIndustryBySlug } from "../data/industryData";
import { useSEOContent } from "../context/SEOContentContext";
import API from "../utils/api";
import "./IndustryPage.css";

const IndustryPage = () => {
  const { industrySlug } = useParams();
  const navigate = useNavigate();
  const { content: seoContextContent } = useSEOContent();
  const baseIndustry = getIndustryBySlug(industrySlug);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [pageSEO, setPageSEO] = useState(null);
  const [loadingSEO, setLoadingSEO] = useState(true);

  // Load page-specific SEO content - ALWAYS fetch fresh from database
  // This ensures changes persist across reloads and work in production
  useEffect(() => {
    const loadPageSEO = async () => {
      if (!baseIndustry) return;
      
      setLoadingSEO(true);
      const pagePath = `/industry/${industrySlug}`;
      try {
        // Always fetch fresh data from Firebase database
        // This ensures changes made in admin panel are immediately visible
        const encodedPath = encodeURIComponent(pagePath);
        const { data } = await API.get(`/seo/page/${encodedPath}`);
        
        // Check if we got actual page-specific content (not just fallback to main)
        // Page-specific content will have pagePath property
        if (data && data.pagePath === pagePath && Object.keys(data).length > 1) {
          setPageSEO(data);
        } else {
          // No page-specific content, use defaults
          setPageSEO(null);
        }
      } catch (err) {
        // If no page-specific content exists, that's fine - use defaults
        setPageSEO(null);
      } finally {
        setLoadingSEO(false);
      }
    };

    // Always reload when slug changes or component mounts
    loadPageSEO();
  }, [industrySlug, baseIndustry]);

  // Merge SEO content with default industry data
  const getNestedValue = (obj, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const industry = baseIndustry ? {
    ...baseIndustry,
    hero: {
      ...baseIndustry.hero,
      title: getNestedValue(pageSEO, 'hero.title') || baseIndustry.hero.title,
      subtitle: getNestedValue(pageSEO, 'hero.subtitle') || baseIndustry.hero.subtitle,
      description: getNestedValue(pageSEO, 'hero.description') || baseIndustry.hero.description,
      backgroundImage: getNestedValue(pageSEO, 'hero.backgroundImage') || baseIndustry.hero.backgroundImage,
    },
    whoAreWe: {
      ...baseIndustry.whoAreWe,
      title: getNestedValue(pageSEO, 'whoAreWe.title') || baseIndustry.whoAreWe.title,
      description: getNestedValue(pageSEO, 'whoAreWe.description') || baseIndustry.whoAreWe.description,
      image1: getNestedValue(pageSEO, 'whoAreWe.image1') || baseIndustry.whoAreWe.image1,
      image2: getNestedValue(pageSEO, 'whoAreWe.image2') || baseIndustry.whoAreWe.image2,
    },
    whyYouNeedUs: {
      ...baseIndustry.whyYouNeedUs,
      title: getNestedValue(pageSEO, 'whyYouNeedUs.title') || baseIndustry.whyYouNeedUs.title,
      description: getNestedValue(pageSEO, 'whyYouNeedUs.description') || baseIndustry.whyYouNeedUs.description,
      image1: getNestedValue(pageSEO, 'whyYouNeedUs.image1') || baseIndustry.whyYouNeedUs.image1,
      benefits: getNestedValue(pageSEO, 'whyYouNeedUs.benefits') || baseIndustry.whyYouNeedUs.benefits,
    },
    whatWeCanDo: {
      ...baseIndustry.whatWeCanDo,
      title: getNestedValue(pageSEO, 'whatWeCanDo.title') || baseIndustry.whatWeCanDo.title,
      description: getNestedValue(pageSEO, 'whatWeCanDo.description') || baseIndustry.whatWeCanDo.description,
      image1: getNestedValue(pageSEO, 'whatWeCanDo.image1') || baseIndustry.whatWeCanDo.image1,
      image2: getNestedValue(pageSEO, 'whatWeCanDo.image2') || baseIndustry.whatWeCanDo.image2,
      image3: getNestedValue(pageSEO, 'whatWeCanDo.image3') || baseIndustry.whatWeCanDo.image3,
      icon1: getNestedValue(pageSEO, 'whatWeCanDo.icon1') || baseIndustry.whatWeCanDo.icon1,
      icon2: getNestedValue(pageSEO, 'whatWeCanDo.icon2') || baseIndustry.whatWeCanDo.icon2,
      services: getNestedValue(pageSEO, 'whatWeCanDo.services') || baseIndustry.whatWeCanDo.services,
    },
    stats: {
      ...baseIndustry.stats,
      title: getNestedValue(pageSEO, 'stats.title') || baseIndustry.stats.title,
      items: getNestedValue(pageSEO, 'stats.items') || baseIndustry.stats.items,
    },
    faq: getNestedValue(pageSEO, 'faq') || baseIndustry.faq,
  } : null;

  if (!baseIndustry || !industry) {
    return (
      <div className="industry-not-found">
        <h1>Industry Not Found</h1>
        <p>The requested industry page could not be found.</p>
        <Link to="/services" className="btn btn-primary">Back to Services</Link>
      </div>
    );
  }

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="industry-page">
      {/* Hero Section - Premium Design */}
      <section 
        className="industry-hero-section"
        style={{
          backgroundImage: industry.hero.backgroundImage 
            ? `url(${industry.hero.backgroundImage})` 
            : 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)'
        }}
      >
        <div className="industry-hero-container">
          <div className="industry-hero-grid">
            {/* Left Side - Content */}
            <div className="industry-hero-content">
              <span className="industry-hero-tag">{industry.title.toUpperCase()}</span>
              <h1 className="industry-hero-title">
                {industry.hero.title}
              </h1>
              <p className="industry-hero-subtitle">{industry.hero.subtitle}</p>
              <p className="industry-hero-description">{industry.hero.description}</p>
              <div className="industry-hero-buttons">
                <button 
                  className="industry-btn industry-btn-primary"
                  onClick={() => navigate('/contact')}
                >
                  Get Started
                </button>
                <button 
                  className="industry-btn industry-btn-outline"
                  onClick={() => navigate('/services')}
                >
                  View All Services
                </button>
              </div>
            </div>
            {/* Right Side - Visual Element or Image */}
            <div className="industry-hero-visual">
              <div className="industry-hero-visual-wrapper">
                <div className="industry-hero-stats-preview">
                  {industry.stats.items.slice(0, 3).map((stat, index) => (
                    <div key={index} className="industry-hero-stat-mini">
                      <div className="industry-hero-stat-number-mini">{stat.number}</div>
                      <div className="industry-hero-stat-label-mini">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section - Exact Replica of StatAbout from Home Page */}
      <section className="industry-who-are-we">
        <div className="industry-who-are-we__container">
          {/* Header Section */}
          <div className="industry-who-are-we__header">
            <h2 className="industry-who-are-we__main-title">
              {industry.whoAreWe.title}
            </h2>
            <p className="industry-who-are-we__main-description">
              {industry.whoAreWe.description}
            </p>
          </div>

          {/* Grid Section - 5 Cards */}
          <div className="industry-who-are-we__grid">
            {/* Card 1 - Large Vertical (Top Left) */}
            <div className="industry-who-are-we__card industry-who-are-we__card--large">
              <div className="industry-who-are-we__card-number">
                {industry.stats.items[0]?.number || "18+"}
              </div>
              <div className="industry-who-are-we__card-content">
                <div className="industry-who-are-we__card-title">{industry.stats.items[0]?.label || "Years of expertise"}</div>
                <div className="industry-who-are-we__card-subtitle">{industry.whoAreWe.points[0] || "Decades of refined recruitment strategies"}</div>
              </div>
            </div>

            {/* Card 2 - Image Placeholder (Top Middle) */}
            <div className="industry-who-are-we__card industry-who-are-we__card--image">
              <img 
                src="/aboutus/aboutus2.png" 
                alt={industry.title} 
                className="industry-who-are-we__card-image"
                loading="lazy"
              />
            </div>

            {/* Card 3 - Stat Card (Top Right) */}
            <div className="industry-who-are-we__card industry-who-are-we__card--stat">
              <div className="industry-who-are-we__card-number">
                {industry.stats.items[1]?.number || "500+"}
              </div>
              <div className="industry-who-are-we__card-content">
                <div className="industry-who-are-we__card-title">{industry.stats.items[1]?.label || "Successful placements"}</div>
                <div className="industry-who-are-we__card-subtitle">{industry.whoAreWe.points[1] || "Connecting talent with opportunity"}</div>
              </div>
            </div>

            {/* Card 4 - Stat Card (Bottom Left) */}
            <div className="industry-who-are-we__card industry-who-are-we__card--stat">
              <div className="industry-who-are-we__card-number">
                {industry.stats.items[2]?.number || "95%"}
              </div>
              <div className="industry-who-are-we__card-content">
                <div className="industry-who-are-we__card-title">{industry.stats.items[2]?.label || "Client satisfaction"}</div>
                <div className="industry-who-are-we__card-subtitle">{industry.whoAreWe.points[2] || "Consistently exceeding expectations"}</div>
              </div>
            </div>

            {/* Card 5 - Image Placeholder (Bottom Right) */}
            <div className="industry-who-are-we__card industry-who-are-we__card--image">
              <img 
                src="/aboutus/aboutus1.png" 
                alt={industry.title} 
                className="industry-who-are-we__card-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why You Need Us Section - Exact Replica of Our Approach from About Us */}
      <section className="industry-why-you-need-us">
        <div className="industry-container">
          <div className="industry-why-you-need-us-header">
            <span className="industry-why-you-need-us-tag">WHY CHOOSE US</span>
            <h2 className="industry-why-you-need-us-title">{industry.whyYouNeedUs.title}</h2>
            <p className="industry-why-you-need-us-subtitle">
              {industry.whyYouNeedUs.description}
            </p>
          </div>

          <div className="industry-why-you-need-us-grid">
            <div className="industry-why-you-need-us-unified-card">
              <div className="industry-why-you-need-us-image-column">
                <img 
                  src="/aboutus/aboutus1.png"
                  alt={industry.title} 
                  className="industry-why-you-need-us-hero-image"
                />
              </div>
              <div className="industry-why-you-need-us-middle-column">
                <div className="industry-why-you-need-us-middle-content">
                  <span className="industry-why-you-need-us-card-tag">Our Expertise</span>
                  <h3 className="industry-why-you-need-us-card-title">{industry.whyYouNeedUs.benefits[0]?.title || "Industry Leadership"}</h3>
                  <p className="industry-why-you-need-us-card-description">
                    {industry.whyYouNeedUs.benefits[0]?.description || "Leading the way in talent acquisition"}
                  </p>
                  <button 
                    className="industry-why-you-need-us-card-link"
                    onClick={() => navigate('/contact')}
                  >
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="industry-why-you-need-us-cards-stack">
              {industry.whyYouNeedUs.benefits.slice(1, 3).map((benefit, index) => (
                <div key={index} className="industry-why-you-need-us-card-small">
                  <div className="industry-why-you-need-us-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 className="industry-why-you-need-us-card-small-title">{benefit.title}</h4>
                  <p className="industry-why-you-need-us-card-small-description">
                    {benefit.description}
                  </p>
                  <button 
                    className="industry-why-you-need-us-card-link"
                    onClick={() => navigate('/contact')}
                  >
                    Explore
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Can Do Section - Exact Replica of Our Domains from About Us */}
      <section className="industry-what-we-can-do">
        <div className="industry-container">
          <div className="industry-what-we-can-do-header">
            <span className="industry-what-we-can-do-label">Our services</span>
            <h2 className="industry-what-we-can-do-title">{industry.whatWeCanDo.title}</h2>
            <p className="industry-what-we-can-do-subtitle">
              {industry.whatWeCanDo.description}
            </p>
          </div>

          <div className="industry-what-we-can-do-grid">
            <div className="industry-what-we-can-do-left-column">
              <div className="industry-what-we-can-do-card-large">
                <div className="industry-what-we-can-do-card-image-wrapper">
                  <img 
                    src="/aboutus/aboutus2.png"
                    alt={industry.whatWeCanDo.services[0] || "Service"} 
                    className="industry-what-we-can-do-card-image"
                  />
                </div>
                <div className="industry-what-we-can-do-card-content">
                  <span className="industry-what-we-can-do-card-category">Service</span>
                  <h3 className="industry-what-we-can-do-card-title">{industry.whatWeCanDo.services[0] || "Comprehensive Solutions"}</h3>
                  <p className="industry-what-we-can-do-card-description">
                    {industry.whatWeCanDo.services[1] || "Expert recruitment services tailored to your needs"}
                  </p>
                  <div className="industry-what-we-can-do-card-ctas">
                    <button 
                      className="industry-what-we-can-do-cta-link"
                      onClick={() => navigate('/contact')}
                    >
                      Explore
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="industry-what-we-can-do-card-bottom-left">
                <div className="industry-what-we-can-do-card-image-wrapper">
                  <img 
                    src="/aboutus/aboutus4.png"
                    alt={industry.whatWeCanDo.services[2] || "Service"} 
                    className="industry-what-we-can-do-card-image"
                  />
                </div>
                <div className="industry-what-we-can-do-card-content">
                  <span className="industry-what-we-can-do-card-category">Service</span>
                  <h3 className="industry-what-we-can-do-card-title">{industry.whatWeCanDo.services[2] || "Specialized Solutions"}</h3>
                  <p className="industry-what-we-can-do-card-description">
                    {industry.whatWeCanDo.services[3] || "Targeted recruitment for specific needs"}
                  </p>
                  <button 
                    className="industry-what-we-can-do-cta-link"
                    onClick={() => navigate('/contact')}
                  >
                    Discover
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="industry-what-we-can-do-right-column">
              <div className="industry-what-we-can-do-cards-stack-top">
                <div className="industry-what-we-can-do-card-small">
                  <div className="industry-what-we-can-do-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h4 className="industry-what-we-can-do-card-small-title">{industry.whatWeCanDo.services[4] || "Professional Services"}</h4>
                  <p className="industry-what-we-can-do-card-small-description">
                    {industry.whatWeCanDo.services[5] || "Expert solutions for your business"}
                  </p>
                  <button 
                    className="industry-what-we-can-do-cta-link"
                    onClick={() => navigate('/contact')}
                  >
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="industry-what-we-can-do-card-small">
                  <div className="industry-what-we-can-do-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 21V13C16 12.4477 15.5523 12 15 12H9C8.44772 12 8 12.4477 8 13V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 className="industry-what-we-can-do-card-small-title">{industry.whatWeCanDo.services[6] || "Enterprise Solutions"}</h4>
                  <p className="industry-what-we-can-do-card-small-description">
                    {industry.whatWeCanDo.services[7] || "Scalable recruitment strategies"}
                  </p>
                  <button 
                    className="industry-what-we-can-do-cta-link"
                    onClick={() => navigate('/contact')}
                  >
                    Connect
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="industry-what-we-can-do-card-large-right">
                <div className="industry-what-we-can-do-card-image-wrapper">
                  <img 
                    src="/aboutus/aboutus3.png"
                    alt={industry.whatWeCanDo.services[8] || "Service"} 
                    className="industry-what-we-can-do-card-image"
                  />
                </div>
                <div className="industry-what-we-can-do-card-content">
                  <span className="industry-what-we-can-do-card-category">Service</span>
                  <h3 className="industry-what-we-can-do-card-title">{industry.whatWeCanDo.services[8] || "Comprehensive Support"}</h3>
                  <p className="industry-what-we-can-do-card-description">
                    {industry.whatWeCanDo.services[9] || "End-to-end recruitment solutions"}
                  </p>
                  <div className="industry-what-we-can-do-card-ctas">
                    <button 
                      className="industry-what-we-can-do-cta-link"
                      onClick={() => navigate('/contact')}
                    >
                      Explore
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Design */}
      <section className="industry-stats-section">
        <div className="industry-container">
          <div className="industry-section-header industry-section-header-light">
            <span className="industry-section-tag industry-section-tag-light">OUR IMPACT</span>
            <h2 className="industry-section-title industry-section-title-light">{industry.stats.title}</h2>
          </div>
          <div className="industry-stats-grid">
            {industry.stats.items.map((stat, index) => (
              <div key={index} className="industry-stat-card">
                <div className="industry-stat-number">{stat.number}</div>
                <div className="industry-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="industry-faq-section">
        <div className="industry-container">
          <div className="industry-section-header">
            <span className="industry-section-tag">FAQ</span>
            <h2 className="industry-section-title">Frequently Asked Questions</h2>
            <p className="industry-section-description">
              Common questions about our {industry.title} recruitment services
            </p>
          </div>
            <div className="industry-faq-list">
              {industry.faq.map((faqItem, index) => (
              <div 
                key={index} 
                className={`industry-faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <button
                  className="industry-faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span>{faqItem.question}</span>
                  <span className="industry-faq-icon">
                    {openFaqIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="industry-faq-answer">
                    <p>{faqItem.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default IndustryPage;
