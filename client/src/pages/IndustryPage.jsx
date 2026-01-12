// client/src/pages/IndustryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIndustryBySlug } from "../data/industryData/index";
import IndustryPageComponent from "../components/industry/IndustryPage.jsx";
import { useSEOContent } from "../context/SEOContentContext";
import API from "../utils/api";

const IndustryPage = () => {
  const { industrySlug } = useParams();
  const navigate = useNavigate();
  // Log the slug and data retrieval attempt
  console.log("IndustryPage: slug =", industrySlug);

  const baseIndustry = getIndustryBySlug(industrySlug);
  console.log("IndustryPage: baseIndustry =", baseIndustry);

  const [pageSEO, setPageSEO] = useState(null);

  // Load page-specific SEO content - ALWAYS fetch fresh from database
  useEffect(() => {
    const loadPageSEO = async () => {
      console.log("IndustryPage: loading SEO for", industrySlug);
      if (!baseIndustry) return;

      const pagePath = `/industry/${industrySlug}`;
      try {
        const encodedPath = encodeURIComponent(pagePath);
        const { data } = await API.get(`/seo/page/${encodedPath}`);

        if (data && data.pagePath === pagePath && Object.keys(data).length > 1) {
          console.log("IndustryPage: loaded SEO", data);
          setPageSEO(data);
        } else {
          setPageSEO(null);
        }
      } catch (err) {
        console.error("IndustryPage: SEO error", err);
        setPageSEO(null);
      }
    };

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
  } : null;

  console.log("IndustryPage: final industry object =", industry);

  if (!baseIndustry) {
    console.warn("IndustryPage: Not found for slug", industrySlug);
    return (
      <div className="industry-page-error" style={{ padding: "100px", textAlign: "center" }}>
        <h2>Industry page not found</h2>
        <p>The requested industry page could not be found.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            marginTop: "20px",
            cursor: "pointer"
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Pass the merged data (or originally base data if no SEO override) to the new component
  return <IndustryPageComponent data={industry} />;
};

export default IndustryPage;
