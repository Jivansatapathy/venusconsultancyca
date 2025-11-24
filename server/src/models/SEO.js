// server/src/models/SEO.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "seoContent";

// Create or update SEO content
const upsertSEO = async (seoData) => {
  try {
    // Check if SEO content already exists (we'll use a single document with id 'main')
    const docRef = db.collection(COLLECTION_NAME).doc('main');
    const doc = await docRef.get();
    
    const seoContent = {
      ...seoData,
      updatedAt: new Date(),
      updatedBy: seoData.updatedBy || 'admin'
    };
    
    if (doc.exists) {
      // Update existing
      await docRef.update(seoContent);
    } else {
      // Create new
      seoContent.createdAt = new Date();
      await docRef.set(seoContent);
    }
    
    return { id: 'main', ...seoContent };
  } catch (error) {
    console.error("Error upserting SEO content:", error);
    throw error;
  }
};

// Get SEO content
const getSEO = async () => {
  try {
    const doc = await db.collection(COLLECTION_NAME).doc('main').get();
    if (!doc.exists) {
      // Return default SEO content and homepage content if none exists
      return {
        id: 'main',
        // SEO Meta Tags
        siteTitle: 'Venus Consultancy - Executive Search & Talent Solutions',
        siteDescription: 'Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring.',
        siteKeywords: 'executive search, talent acquisition, leadership hiring, recruitment, headhunting',
        defaultMetaTitle: 'Venus Consultancy - Executive Search & Talent Solutions',
        defaultMetaDescription: 'Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring.',
        ogTitle: 'Venus Consultancy - Executive Search & Talent Solutions',
        ogDescription: 'Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring.',
        ogImage: '/venuslogo.png',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Venus Consultancy - Executive Search & Talent Solutions',
        twitterDescription: 'Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring.',
        twitterImage: '/venuslogo.png',
        // Homepage Content - Hero Section
        heroGreeting: '- Empower Your Workforce -',
        heroTitleLine1: 'Shape the Future of',
        heroTitleLine2: 'Your Organization Today',
        heroSubtitle: 'Connect with top-tier talent across Canada and discover professionals who drive growth, innovation, and success for Canadian businesses.',
        heroButton1Text: 'Book a Consultation',
        heroButton1Link: '/book-call',
        heroButton2Text: 'Our Services',
        heroButton2Link: '/services',
        // Homepage Content - About Section
        aboutTag: 'ABOUT VENUS HIRING',
        aboutTitle: 'Driving Success With An Expert Staffing',
        aboutDescription: 'At Venus Consultancy, we understand that the key to business success lies in having the right people on your team. As a leading Canadian recruitment firm based in Toronto, we\'re committed to connecting Canadian companies with exceptional talent across Canada. Our deep understanding of the Canadian job market, from Vancouver to Halifax, enables us to find the perfect match for businesses nationwide.',
        aboutStatClients: 77,
        aboutStatSatisfaction: 98,
        aboutStatSuccess: 99,
        aboutStatClientsLabel: 'Trusted Partnerships',
        aboutStatSatisfactionLabel: 'Client Satisfaction',
        aboutStatSuccessLabel: 'Success Rate',
        aboutCtaText: 'JOIN OUR NETWORK',
        aboutCtaLink: '/book-call',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    const data = doc.data();
    return { id: doc.id, ...data };
  } catch (error) {
    console.error("Error getting SEO content:", error);
    throw error;
  }
};

// Get SEO content for a specific page
const getSEOByPage = async (pagePath) => {
  try {
    // First try to get page-specific SEO
    const pageDoc = await db.collection(COLLECTION_NAME).doc(`page_${pagePath.replace(/\//g, '_')}`).get();
    
    if (pageDoc.exists) {
      return { id: pageDoc.id, ...pageDoc.data() };
    }
    
    // Fall back to main SEO content
    return await getSEO();
  } catch (error) {
    console.error("Error getting SEO by page:", error);
    // Fall back to main SEO
    return await getSEO();
  }
};

// Create or update page-specific SEO
const upsertPageSEO = async (pagePath, seoData) => {
  try {
    const docId = `page_${pagePath.replace(/\//g, '_')}`;
    const docRef = db.collection(COLLECTION_NAME).doc(docId);
    const doc = await docRef.get();
    
    const seoContent = {
      ...seoData,
      pagePath,
      updatedAt: new Date(),
      updatedBy: seoData.updatedBy || 'admin'
    };
    
    if (doc.exists) {
      await docRef.update(seoContent);
    } else {
      seoContent.createdAt = new Date();
      await docRef.set(seoContent);
    }
    
    return { id: docId, ...seoContent };
  } catch (error) {
    console.error("Error upserting page SEO:", error);
    throw error;
  }
};

// Get all page-specific SEO entries
const getAllPageSEO = async () => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where('pagePath', '!=', null)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all page SEO:", error);
    return [];
  }
};

// Delete page-specific SEO
const deletePageSEO = async (pagePath) => {
  try {
    const docId = `page_${pagePath.replace(/\//g, '_')}`;
    await db.collection(COLLECTION_NAME).doc(docId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting page SEO:", error);
    throw error;
  }
};

const SEO = {
  upsert: upsertSEO,
  get: getSEO,
  getByPage: getSEOByPage,
  upsertPage: upsertPageSEO,
  getAllPages: getAllPageSEO,
  deletePage: deletePageSEO
};

export default SEO;

