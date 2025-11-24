// client/src/context/SEOContentContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../utils/api";

export const SEOContentContext = createContext();

export function SEOContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEOContent = async () => {
      try {
        const { data } = await API.get('/seo');
        setContent(data);
      } catch (err) {
        console.error('Error fetching SEO content:', err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOContent();
  }, []);

  return (
    <SEOContentContext.Provider value={{ content, loading }}>
      {children}
    </SEOContentContext.Provider>
  );
}

export function useSEOContent() {
  const context = useContext(SEOContentContext);
  if (!context) {
    throw new Error('useSEOContent must be used within SEOContentProvider');
  }
  return context;
}

