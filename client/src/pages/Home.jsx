import React, { Suspense, lazy, useState, useEffect } from "react";
import Hero from "../components/ThirdHero";
import ScrollingBanner from "../components/ScrollingBanner";
import StatAbout from "../components/StatAbout";
import API from "../utils/api";

// Lazy load heavy components that are below the fold
const Certifications = lazy(() => import("../components/Certifications"));
const WhyStats = lazy(() => import("../components/WhyStats"));
const TalentSection = lazy(() => import("../components/TalentSection"));
const ServicesSection = lazy(() => import("../components/ServicesSection"));
const BlogSection = lazy(() => import("../components/BlogSection"));
const FAQ = lazy(() => import("../components/FAQ"));

// Loading fallback for lazy components
const LazyFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100px',
    fontSize: '16px',
    color: '#666'
  }}>
    Loading...
  </div>
);
export default function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await API.get('/seo');
        setHomeContent(data);
      } catch (err) {
        console.error('Error fetching home content:', err);
        // Use default content if API fails
        setHomeContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  return (
    <>
      <Hero content={homeContent} />
      <ScrollingBanner />
      <StatAbout content={homeContent} />
      <Suspense fallback={<LazyFallback />}>
        <ServicesSection/>
      </Suspense>
      <Suspense fallback={<LazyFallback />}>
        <TalentSection/>
      </Suspense>
      {/* Certifications section removed as requested */}
      {/* JourneyStats section removed as requested */}
      <Suspense fallback={<LazyFallback />}>
        <WhyStats />
      </Suspense>
      <Suspense fallback={<LazyFallback />}>
        <BlogSection/>
      </Suspense>
      <Suspense fallback={<LazyFallback />}>
        <FAQ />
      </Suspense>
    </>
  );
}
