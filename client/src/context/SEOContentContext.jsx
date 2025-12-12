// client/src/context/SEOContentContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../utils/api";

export const SEOContentContext = createContext();

export function SEOContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSEOContent = async () => {
    try {
      const { data } = await API.get('/seo');
      
      // Also fetch all page-specific SEO entries (only if user is admin)
      // For public users, pages will fetch individually
      try {
        const { data: pagesData } = await API.get('/seo/pages');
        
        // Organize pages by path
        const pagesMap = {};
        if (Array.isArray(pagesData)) {
          pagesData.forEach(page => {
            if (page.pagePath) {
              pagesMap[page.pagePath] = page;
            }
          });
        }
        
        setContent({
          ...data,
          pages: pagesMap
        });
      } catch (pagesErr) {
        // If pages endpoint fails (e.g., not admin), just use main content
        // Individual pages will fetch their own SEO content
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching SEO content:', err);
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOContent();
  }, []);

  // Refresh function to reload content (useful after admin updates)
  const refresh = () => {
    setLoading(true);
    fetchSEOContent();
  };

  return (
    <SEOContentContext.Provider value={{ content, loading, refresh }}>
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

