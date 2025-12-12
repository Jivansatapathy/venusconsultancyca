// client/src/hooks/usePageSEO.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../utils/api';

/**
 * Custom hook to load page-specific SEO content from Firebase
 * @param {string} pagePath - The page path (e.g., '/about', '/contact')
 * @returns {object} - { pageSEO, loadingSEO, getNestedValue }
 */
export const usePageSEO = (pagePath) => {
  const [pageSEO, setPageSEO] = useState(null);
  const [loadingSEO, setLoadingSEO] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadPageSEO = async () => {
      if (!pagePath) return;
      
      setLoadingSEO(true);
      try {
        const encodedPath = encodeURIComponent(pagePath);
        const { data } = await API.get(`/seo/page/${encodedPath}`);
        
        // Check if we got actual page-specific content (not just fallback to main)
        if (data && data.pagePath === pagePath && Object.keys(data).length > 1) {
          setPageSEO(data);
        } else {
          setPageSEO(null);
        }
      } catch (err) {
        // If no page-specific content exists, that's fine - use defaults
        setPageSEO(null);
      } finally {
        setLoadingSEO(false);
      }
    };

    loadPageSEO();
  }, [pagePath, location.pathname]);

  const getNestedValue = (obj, path) => {
    if (!path || !obj) return undefined;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  return { pageSEO, loadingSEO, getNestedValue };
};


