// client/src/config/pageSchemas.js
// This file defines the editable fields for each page type
// When you add a new page, just add its schema here and it will automatically appear in the SEO admin panel

export const pageSchemas = {
  // Homepage schema (existing)
  '/': {
    name: 'Homepage',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'heroGreeting', label: 'Hero Greeting', type: 'text', path: 'heroGreeting' },
          { key: 'heroTitleLine1', label: 'Hero Title Line 1', type: 'text', path: 'heroTitleLine1' },
          { key: 'heroTitleLine2', label: 'Hero Title Line 2', type: 'text', path: 'heroTitleLine2' },
          { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea', path: 'heroSubtitle' },
          { key: 'heroButton1Text', label: 'Primary Button Text', type: 'text', path: 'heroButton1Text' },
          { key: 'heroButton1Link', label: 'Primary Button Link', type: 'text', path: 'heroButton1Link' },
          { key: 'heroButton2Text', label: 'Secondary Button Text', type: 'text', path: 'heroButton2Text' },
          { key: 'heroButton2Link', label: 'Secondary Button Link', type: 'text', path: 'heroButton2Link' },
        ]
      },
      about: {
        title: 'About Section',
        fields: [
          { key: 'aboutTag', label: 'About Tag', type: 'text', path: 'aboutTag' },
          { key: 'aboutTitle', label: 'About Title', type: 'text', path: 'aboutTitle' },
          { key: 'aboutDescription', label: 'About Description', type: 'textarea', path: 'aboutDescription' },
          { key: 'aboutStatClients', label: 'Stat 1 - Number', type: 'number', path: 'aboutStatClients' },
          { key: 'aboutStatClientsLabel', label: 'Stat 1 - Label', type: 'text', path: 'aboutStatClientsLabel' },
          { key: 'aboutStatSatisfaction', label: 'Stat 2 - Number', type: 'number', path: 'aboutStatSatisfaction' },
          { key: 'aboutStatSatisfactionLabel', label: 'Stat 2 - Label', type: 'text', path: 'aboutStatSatisfactionLabel' },
          { key: 'aboutStatSuccess', label: 'Stat 3 - Number', type: 'number', path: 'aboutStatSuccess' },
          { key: 'aboutStatSuccessLabel', label: 'Stat 3 - Label', type: 'text', path: 'aboutStatSuccessLabel' },
          { key: 'aboutCtaText', label: 'CTA Button Text', type: 'text', path: 'aboutCtaText' },
          { key: 'aboutCtaLink', label: 'CTA Button Link', type: 'text', path: 'aboutCtaLink' },
        ]
      }
    }
  },
  
  // Industry pages schema (auto-generated pattern)
  '/industry/:industrySlug': {
    name: 'Industry Pages',
    dynamic: true, // This means it's a dynamic route
    pattern: '/industry/:industrySlug',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'text', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Hero Description', type: 'textarea', path: 'hero.description' },
          { key: 'hero.backgroundImage', label: 'Background Image URL', type: 'text', path: 'hero.backgroundImage' },
        ]
      },
      whoAreWe: {
        title: 'Who Are We Section',
        fields: [
          { key: 'whoAreWe.title', label: 'Section Title', type: 'text', path: 'whoAreWe.title' },
          { key: 'whoAreWe.description', label: 'Description', type: 'textarea', path: 'whoAreWe.description', rows: 5 },
          { key: 'whoAreWe.image1', label: 'Image 1 URL', type: 'text', path: 'whoAreWe.image1' },
          { key: 'whoAreWe.image2', label: 'Image 2 URL', type: 'text', path: 'whoAreWe.image2' },
        ]
      },
      whyYouNeedUs: {
        title: 'Why You Need Us Section',
        fields: [
          { key: 'whyYouNeedUs.title', label: 'Section Title', type: 'text', path: 'whyYouNeedUs.title' },
          { key: 'whyYouNeedUs.description', label: 'Description', type: 'textarea', path: 'whyYouNeedUs.description', rows: 5 },
          { key: 'whyYouNeedUs.image1', label: 'Image URL', type: 'text', path: 'whyYouNeedUs.image1' },
          { key: 'whyYouNeedUs.benefits', label: 'Benefits', type: 'array', path: 'whyYouNeedUs.benefits', 
            itemFields: [
              { key: 'title', label: 'Benefit Title', type: 'text' },
              { key: 'description', label: 'Benefit Description', type: 'textarea', rows: 3 }
            ]
          },
        ]
      },
      whatWeCanDo: {
        title: 'What We Can Do Section',
        fields: [
          { key: 'whatWeCanDo.title', label: 'Section Title', type: 'text', path: 'whatWeCanDo.title' },
          { key: 'whatWeCanDo.description', label: 'Description', type: 'textarea', path: 'whatWeCanDo.description', rows: 5 },
          { key: 'whatWeCanDo.image1', label: 'Image 1 URL', type: 'text', path: 'whatWeCanDo.image1' },
          { key: 'whatWeCanDo.image2', label: 'Image 2 URL', type: 'text', path: 'whatWeCanDo.image2' },
          { key: 'whatWeCanDo.image3', label: 'Image 3 URL', type: 'text', path: 'whatWeCanDo.image3' },
          { key: 'whatWeCanDo.icon1', label: 'Icon 1 URL', type: 'text', path: 'whatWeCanDo.icon1' },
          { key: 'whatWeCanDo.icon2', label: 'Icon 2 URL', type: 'text', path: 'whatWeCanDo.icon2' },
          { key: 'whatWeCanDo.services', label: 'Services (one per line)', type: 'textarea', path: 'whatWeCanDo.services', rows: 8, array: true },
        ]
      },
      stats: {
        title: 'Stats Section',
        fields: [
          { key: 'stats.title', label: 'Section Title', type: 'text', path: 'stats.title' },
          { key: 'stats.items', label: 'Stats', type: 'array', path: 'stats.items',
            itemFields: [
              { key: 'number', label: 'Stat Number', type: 'text' },
              { key: 'label', label: 'Stat Label', type: 'text' }
            ]
          },
        ]
      },
      faq: {
        title: 'FAQ Section',
        fields: [
          { key: 'faq', label: 'FAQ Items', type: 'array', path: 'faq',
            itemFields: [
              { key: 'question', label: 'Question', type: 'text' },
              { key: 'answer', label: 'Answer', type: 'textarea', rows: 4 }
            ]
          },
        ]
      }
    }
  },
  
  // Services page
  '/services': {
    name: 'Services Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
        ]
      }
    }
  },
  
  // Gallery page
  '/gallery': {
    name: 'Gallery Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
        ]
      }
    }
  },
  
  // Contact page
  '/contact': {
    name: 'Contact Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
        ]
      }
    }
  },
  
  // About Us page
  '/about': {
    name: 'About Us Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.tag', label: 'Hero Tag', type: 'text', path: 'hero.tag' },
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.titleHighlight', label: 'Title Highlight Text', type: 'text', path: 'hero.titleHighlight' },
          { key: 'hero.description', label: 'Hero Description', type: 'textarea', path: 'hero.description', rows: 5 },
          { key: 'hero.image', label: 'Hero Image URL', type: 'text', path: 'hero.image' },
        ]
      },
      mission: {
        title: 'Mission Section',
        fields: [
          { key: 'mission.title', label: 'Section Title', type: 'text', path: 'mission.title' },
          { key: 'mission.description', label: 'Description', type: 'textarea', path: 'mission.description', rows: 5 },
        ]
      },
      values: {
        title: 'Values Section',
        fields: [
          { key: 'values.title', label: 'Section Title', type: 'text', path: 'values.title' },
          { key: 'values.items', label: 'Values', type: 'array', path: 'values.items',
            itemFields: [
              { key: 'title', label: 'Value Title', type: 'text' },
              { key: 'description', label: 'Value Description', type: 'textarea', rows: 3 }
            ]
          },
        ]
      }
    }
  },
  
  // Find Jobs page
  '/find-jobs': {
    name: 'Find Jobs Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description', type: 'textarea', path: 'hero.description', rows: 4 },
        ]
      },
      filters: {
        title: 'Filter Section',
        fields: [
          { key: 'filters.title', label: 'Section Title', type: 'text', path: 'filters.title' },
          { key: 'filters.description', label: 'Description', type: 'textarea', path: 'filters.description', rows: 3 },
        ]
      }
    }
  },
  
  // Book Call page
  '/book-call': {
    name: 'Book A Call Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description', type: 'textarea', path: 'hero.description', rows: 4 },
        ]
      },
      form: {
        title: 'Form Section',
        fields: [
          { key: 'form.title', label: 'Form Title', type: 'text', path: 'form.title' },
          { key: 'form.subtitle', label: 'Form Subtitle', type: 'textarea', path: 'form.subtitle', rows: 3 },
          { key: 'form.successMessage', label: 'Success Message', type: 'textarea', path: 'form.successMessage', rows: 3 },
        ]
      }
    }
  },
  
  // Blogs page
  '/blogs': {
    name: 'Blogs Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description', type: 'textarea', path: 'hero.description', rows: 4 },
        ]
      },
      empty: {
        title: 'Empty State',
        fields: [
          { key: 'empty.title', label: 'No Blogs Title', type: 'text', path: 'empty.title' },
          { key: 'empty.message', label: 'No Blogs Message', type: 'textarea', path: 'empty.message', rows: 3 },
        ]
      }
    }
  },
  
  // Blog Detail page (dynamic)
  '/blog/:slug': {
    name: 'Blog Detail Pages',
    dynamic: true,
    pattern: '/blog/:slug',
    sections: {
      meta: {
        title: 'Meta Information',
        fields: [
          { key: 'meta.title', label: 'Page Title Override', type: 'text', path: 'meta.title' },
          { key: 'meta.description', label: 'Meta Description', type: 'textarea', path: 'meta.description', rows: 3 },
        ]
      }
    }
  },
  
  // Hiring page
  '/hiring': {
    name: 'Hiring Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description', type: 'textarea', path: 'hero.description', rows: 4 },
        ]
      }
    }
  },
  
  // Hiring dynamic page (job role specific)
  '/hiring/:jobRole': {
    name: 'Hiring Job Role Pages',
    dynamic: true,
    pattern: '/hiring/:jobRole',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title Override', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle Override', type: 'textarea', path: 'hero.subtitle' },
        ]
      },
      description: {
        title: 'Job Description',
        fields: [
          { key: 'description.overview', label: 'Job Overview', type: 'textarea', path: 'description.overview', rows: 5 },
          { key: 'description.duties', label: 'Key Duties (one per line)', type: 'textarea', path: 'description.duties', rows: 8, array: true },
        ]
      }
    }
  },
  
  // Job Roles page
  '/job-roles': {
    name: 'Job Roles Page',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description', type: 'textarea', path: 'hero.description', rows: 4 },
        ]
      }
    }
  },
  
  // Service Category page (dynamic)
  '/service-category/:categoryKey': {
    name: 'Service Category Pages',
    dynamic: true,
    pattern: '/service-category/:categoryKey',
    sections: {
      hero: {
        title: 'Hero Section',
        fields: [
          { key: 'hero.title', label: 'Hero Title Override', type: 'text', path: 'hero.title' },
          { key: 'hero.subtitle', label: 'Hero Subtitle Override', type: 'textarea', path: 'hero.subtitle' },
          { key: 'hero.description', label: 'Description Override', type: 'textarea', path: 'hero.description', rows: 5 },
        ]
      },
      content: {
        title: 'Content Section',
        fields: [
          { key: 'content.description', label: 'Page Description', type: 'textarea', path: 'content.description', rows: 8 },
          { key: 'content.features', label: 'Features (one per line)', type: 'textarea', path: 'content.features', rows: 8, array: true },
        ]
      }
    }
  },
  
  // Privacy Policy page
  '/privacy': {
    name: 'Privacy Policy Page',
    sections: {
      header: {
        title: 'Page Header',
        fields: [
          { key: 'header.title', label: 'Page Title', type: 'text', path: 'header.title' },
          { key: 'header.lastUpdated', label: 'Last Updated Date', type: 'text', path: 'header.lastUpdated' },
        ]
      },
      content: {
        title: 'Content Sections',
        fields: [
          { key: 'content.sections', label: 'Content Sections', type: 'array', path: 'content.sections',
            itemFields: [
              { key: 'title', label: 'Section Title', type: 'text' },
              { key: 'content', label: 'Section Content', type: 'textarea', rows: 10 }
            ]
          },
        ]
      }
    }
  },
  
  // Terms of Service page
  '/terms': {
    name: 'Terms of Service Page',
    sections: {
      header: {
        title: 'Page Header',
        fields: [
          { key: 'header.title', label: 'Page Title', type: 'text', path: 'header.title' },
          { key: 'header.lastUpdated', label: 'Last Updated Date', type: 'text', path: 'header.lastUpdated' },
        ]
      },
      content: {
        title: 'Content Sections',
        fields: [
          { key: 'content.sections', label: 'Content Sections', type: 'array', path: 'content.sections',
            itemFields: [
              { key: 'title', label: 'Section Title', type: 'text' },
              { key: 'content', label: 'Section Content', type: 'textarea', rows: 10 }
            ]
          },
        ]
      }
    }
  },
  
  // Disclaimer page
  '/disclaimer': {
    name: 'Disclaimer Page',
    sections: {
      header: {
        title: 'Page Header',
        fields: [
          { key: 'header.title', label: 'Page Title', type: 'text', path: 'header.title' },
          { key: 'header.lastUpdated', label: 'Last Updated Date', type: 'text', path: 'header.lastUpdated' },
        ]
      },
      content: {
        title: 'Content Sections',
        fields: [
          { key: 'content.sections', label: 'Content Sections', type: 'array', path: 'content.sections',
            itemFields: [
              { key: 'title', label: 'Section Title', type: 'text' },
              { key: 'content', label: 'Section Content', type: 'textarea', rows: 10 }
            ]
          },
        ]
      }
    }
  }
};

// Helper to get schema for a route
export const getPageSchema = (pathname) => {
  // Check exact matches first
  if (pageSchemas[pathname]) {
    return pageSchemas[pathname];
  }
  
  // Check dynamic routes
  for (const [pattern, schema] of Object.entries(pageSchemas)) {
    if (schema.dynamic && schema.pattern) {
      // Convert pattern to regex (e.g., /industry/:industrySlug -> /industry/([^/]+))
      const regexPattern = '^' + schema.pattern.replace(/:[^/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(regexPattern);
      if (regex.test(pathname)) {
        return schema;
      }
    }
  }
  
  return null;
};

// Get all page paths from schemas
export const getAllPagePaths = () => {
  return Object.entries(pageSchemas).map(([pattern, schema]) => ({
    pattern,
    schema,
    name: schema.name
  }));
};

// Get all industry slugs for dynamic routes
export const getIndustrySlugs = async () => {
  try {
    // Import dynamically to avoid circular dependencies
    const { industryData } = await import('../data/industryData');
    return Object.keys(industryData).map(slug => ({
      slug,
      path: `/industry/${slug}`,
      title: industryData[slug].title
    }));
  } catch (error) {
    console.error('Error loading industry data:', error);
    return [];
  }
};

// Get all blog slugs for dynamic routes
export const getBlogSlugs = async () => {
  try {
    // This would need to fetch from API or import from data file
    // For now, return empty array - blogs are managed in admin panel
    // You can enhance this to fetch from API: const { data } = await API.get('/blogs');
    return [];
  } catch (error) {
    console.error('Error loading blog slugs:', error);
    return [];
  }
};

// Get all job role keys for dynamic routes
export const getJobRoleKeys = async () => {
  try {
    const { jobRolesData } = await import('../data/jobRolesData');
    return Object.keys(jobRolesData).map(key => ({
      key,
      path: `/hiring/${key}`,
      title: jobRolesData[key].title || key
    }));
  } catch (error) {
    console.error('Error loading job role data:', error);
    return [];
  }
};

// Get all service category keys for dynamic routes
export const getServiceCategoryKeys = async () => {
  try {
    // This would need to fetch from API or import from data file
    // For now, return empty array - categories are managed elsewhere
    return [];
  } catch (error) {
    console.error('Error loading service category keys:', error);
    return [];
  }
};

