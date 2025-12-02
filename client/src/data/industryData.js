// client/src/data/industryData.js
// Industry-specific content for individual industry pages

export const industryData = {
  technology: {
    slug: "technology",
    title: "Technology & Software Development",
    hero: {
      title: "Technology Recruitment Excellence",
      subtitle: "Connecting innovative companies with top-tier tech talent",
      description: "We specialize in placing software engineers, developers, and IT professionals who drive digital transformation and innovation.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Technology",
      description: "Venus Consultancy is a leading technology recruitment firm with deep expertise in software development, IT infrastructure, and emerging technologies. We understand the unique demands of tech companies and the skills required to build world-class products.",
      points: [
        "18+ years of experience in technology recruitment",
        "Extensive network of 10,000+ tech professionals",
        "Specialized knowledge in cutting-edge technologies",
        "Partnerships with leading tech companies across North America"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Technology recruitment requires more than just matching resumes. We understand the technical nuances, cultural fit, and growth potential that make successful tech hires.",
      benefits: [
        {
          title: "Technical Expertise",
          description: "Our recruiters have technical backgrounds and understand the difference between React and Angular, microservices architecture, and cloud platforms."
        },
        {
          title: "Speed to Market",
          description: "Average placement time of 2-4 weeks, helping you fill critical roles quickly without compromising quality."
        },
        {
          title: "Quality Guarantee",
          description: "95% retention rate with our placements, backed by comprehensive technical assessments and cultural fit evaluation."
        },
        {
          title: "Scalable Solutions",
          description: "From individual contributors to entire engineering teams, we scale with your hiring needs."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Our comprehensive technology recruitment services cover the entire talent acquisition lifecycle.",
      services: [
        "Full-stack, frontend, and backend developer recruitment",
        "DevOps, Cloud, and Infrastructure engineering placements",
        "Data Science, AI, and Machine Learning talent acquisition",
        "Cybersecurity and IT security specialist placement",
        "Technical leadership and CTO executive search",
        "QA, Testing, and Automation engineering recruitment",
        "Product management and technical product owner placement",
        "24/7 technical support and candidate management"
      ]
    },
    stats: {
      title: "Our Technology Recruitment Stats",
      items: [
        { number: "10,000+", label: "Tech Professionals in Network" },
        { number: "500+", label: "Technology Companies Served" },
        { number: "95%", label: "Placement Success Rate" },
        { number: "2-4 weeks", label: "Average Placement Time" },
        { number: "18+", label: "Years of Experience" }
      ]
    },
    faq: [
      {
        question: "What types of technology roles do you recruit for?",
        answer: "We recruit for all technology roles including software developers (full-stack, frontend, backend), DevOps engineers, cloud architects, data scientists, AI/ML engineers, cybersecurity specialists, QA engineers, technical leads, engineering managers, and CTOs."
      },
      {
        question: "How do you assess technical skills?",
        answer: "We use a combination of technical assessments, coding challenges, portfolio reviews, and in-depth technical interviews. Our recruiters have technical backgrounds and work with your team to design assessments that match your specific requirements."
      },
      {
        question: "What is your average time to fill a tech role?",
        answer: "Our average placement time is 2-4 weeks, depending on the role's seniority and specific requirements. We maintain a large network of pre-screened candidates to ensure quick turnaround times."
      },
      {
        question: "Do you handle remote and hybrid tech positions?",
        answer: "Yes, we specialize in remote, hybrid, and on-site technology positions. We understand the unique requirements of each work model and match candidates accordingly."
      },
      {
        question: "What technologies and programming languages do you cover?",
        answer: "We cover all major technologies including JavaScript, Python, Java, C++, Go, Rust, React, Angular, Vue, Node.js, AWS, Azure, GCP, Docker, Kubernetes, and emerging technologies like AI/ML frameworks."
      }
    ]
  },
  healthcare: {
    slug: "healthcare",
    title: "Healthcare & Medical Recruitment",
    hero: {
      title: "Healthcare Talent Solutions",
      subtitle: "Connecting healthcare facilities with qualified medical professionals",
      description: "We specialize in placing licensed healthcare professionals across all specialties, ensuring compliance and quality patient care.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Healthcare",
      description: "Venus Consultancy is a trusted healthcare recruitment partner with extensive experience in medical staffing. We understand the critical importance of qualified, licensed professionals in healthcare settings.",
      points: [
        "Specialized healthcare recruitment expertise",
        "Network of 5,000+ licensed medical professionals",
        "Compliance with healthcare regulations and certifications",
        "Partnerships with hospitals, clinics, and medical facilities"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Healthcare recruitment requires understanding of medical qualifications, licensing requirements, and the unique demands of patient care environments.",
      benefits: [
        {
          title: "Licensed Professionals",
          description: "All candidates are verified for licenses, certifications, and credentials before placement."
        },
        {
          title: "Regulatory Compliance",
          description: "We ensure all placements meet healthcare regulations, HIPAA compliance, and industry standards."
        },
        {
          title: "Quick Placement",
          description: "Average placement time of 1-3 weeks to fill critical healthcare positions quickly."
        },
        {
          title: "Quality Assurance",
          description: "98% success rate with comprehensive background checks and credential verification."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive healthcare recruitment services covering all medical specialties and support roles.",
      services: [
        "Physician and specialist recruitment (all specialties)",
        "Nursing staff placement (RN, LPN, NP, CNA)",
        "Allied health professional recruitment",
        "Healthcare administration and management placement",
        "Medical billing and coding specialist recruitment",
        "Clinical research coordinator placement",
        "Medical device and healthcare IT specialist recruitment",
        "Temporary and permanent staffing solutions"
      ]
    },
    stats: {
      title: "Our Healthcare Recruitment Stats",
      items: [
        { number: "5,000+", label: "Licensed Healthcare Professionals" },
        { number: "200+", label: "Healthcare Facilities Served" },
        { number: "98%", label: "Placement Success Rate" },
        { number: "1-3 weeks", label: "Average Placement Time" },
        { number: "100%", label: "Credential Verification Rate" }
      ]
    },
    faq: [
      {
        question: "What healthcare roles do you recruit for?",
        answer: "We recruit for all healthcare roles including physicians, nurse practitioners, registered nurses, licensed practical nurses, physician assistants, pharmacists, medical technologists, physical therapists, occupational therapists, and healthcare administrators."
      },
      {
        question: "How do you verify medical licenses and credentials?",
        answer: "We conduct comprehensive credential verification including license validation, certification checks, education verification, and background screening. All candidates are pre-screened before presentation."
      },
      {
        question: "Do you handle temporary and permanent placements?",
        answer: "Yes, we provide both temporary (locum tenens) and permanent healthcare staffing solutions to meet your facility's needs."
      },
      {
        question: "What specialties do you cover?",
        answer: "We cover all medical specialties including primary care, emergency medicine, surgery, pediatrics, cardiology, oncology, radiology, and all other medical and surgical specialties."
      },
      {
        question: "How do you ensure HIPAA compliance?",
        answer: "All our healthcare candidates are trained on HIPAA compliance, and we ensure all placements meet healthcare privacy and security regulations."
      }
    ]
  },
  finance: {
    slug: "finance",
    title: "Finance & Banking Recruitment",
    hero: {
      title: "Financial Talent Excellence",
      subtitle: "Connecting financial institutions with top finance and banking professionals",
      description: "We specialize in placing qualified finance professionals, from accountants to CFOs, ensuring your financial operations run smoothly.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Finance",
      description: "Venus Consultancy is a leading finance recruitment firm with deep expertise in accounting, banking, investment, and financial services. We understand the regulatory landscape and the skills required for financial excellence.",
      points: [
        "Specialized finance and banking recruitment",
        "Network of 3,000+ finance professionals",
        "CFA, CPA, and other certification expertise",
        "Partnerships with banks, investment firms, and corporations"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Finance recruitment requires understanding of financial regulations, certifications, and the analytical skills needed for financial success.",
      benefits: [
        {
          title: "Certified Professionals",
          description: "Access to CFA, CPA, CMA, and other certified finance professionals with verified credentials."
        },
        {
          title: "Regulatory Expertise",
          description: "Deep understanding of financial regulations, compliance requirements, and industry standards."
        },
        {
          title: "Fast-Track Hiring",
          description: "Average placement time of 2-3 weeks with pre-screened, qualified candidates."
        },
        {
          title: "Quality Placements",
          description: "92% success rate with comprehensive financial background checks and skill assessments."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive finance and banking recruitment services covering all financial roles and specialties.",
      services: [
        "CFO, Controller, and senior finance executive search",
        "Accounting and audit professional placement",
        "Investment banking and capital markets recruitment",
        "Risk management and compliance specialist placement",
        "Financial analysis and FP&A recruitment",
        "Tax and treasury specialist placement",
        "Fintech and digital banking recruitment",
        "Back-office accounting and bookkeeping placement"
      ]
    },
    stats: {
      title: "Our Finance Recruitment Stats",
      items: [
        { number: "3,000+", label: "Finance Professionals in Network" },
        { number: "150+", label: "Financial Institutions Served" },
        { number: "92%", label: "Placement Success Rate" },
        { number: "2-3 weeks", label: "Average Placement Time" },
        { number: "85%", label: "Certified Professionals" }
      ]
    },
    faq: [
      {
        question: "What finance roles do you recruit for?",
        answer: "We recruit for all finance roles including CFOs, controllers, financial analysts, accountants, investment bankers, risk managers, compliance officers, tax specialists, treasury managers, and fintech professionals."
      },
      {
        question: "Do you verify certifications like CPA and CFA?",
        answer: "Yes, we verify all professional certifications including CPA, CFA, CMA, FRM, and other relevant finance certifications before placement."
      },
      {
        question: "What industries do you serve in finance?",
        answer: "We serve banks, investment firms, insurance companies, accounting firms, corporations, fintech companies, and all financial services organizations."
      },
      {
        question: "How do you assess financial skills?",
        answer: "We use technical assessments, case studies, financial modeling tests, and in-depth interviews to evaluate candidates' financial acumen and analytical skills."
      },
      {
        question: "Do you handle both permanent and contract finance positions?",
        answer: "Yes, we provide both permanent and contract/temporary finance staffing solutions to meet your organization's needs."
      }
    ]
  },
  aerospace: {
    slug: "aerospace",
    title: "Aerospace Engineering Recruitment",
    hero: {
      title: "Aerospace Talent Solutions",
      subtitle: "Connecting aerospace companies with certified engineering talent",
      description: "We specialize in placing aerospace engineers, avionics specialists, and safety-critical systems experts for aviation and space programs.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Aerospace",
      description: "Venus Consultancy is a specialized aerospace recruitment firm with expertise in aviation, defense, and space industries. We understand the critical nature of aerospace engineering and safety requirements.",
      points: [
        "Specialized aerospace and defense recruitment",
        "Network of certified aerospace engineers",
        "DO-178 and safety-critical systems expertise",
        "Partnerships with major aerospace companies"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Aerospace recruitment requires understanding of safety-critical systems, certifications, and the precision needed for aviation and space programs.",
      benefits: [
        {
          title: "Certified Engineers",
          description: "Access to DO-178 certified engineers and safety-critical systems specialists with verified credentials."
        },
        {
          title: "Safety Expertise",
          description: "Deep understanding of aerospace safety standards, regulations, and certification requirements."
        },
        {
          title: "Technical Precision",
          description: "Specialized knowledge in avionics, flight software, and aerospace systems engineering."
        },
        {
          title: "Quality Assurance",
          description: "Rigorous screening process ensuring candidates meet aerospace industry standards and requirements."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive aerospace recruitment services covering all engineering disciplines and specialties.",
      services: [
        "Aerospace and avionics engineer placement",
        "Flight software and embedded systems recruitment",
        "DO-178 certification expert placement",
        "Systems integration and validation engineer recruitment",
        "Structural and propulsion engineer placement",
        "Flight test engineer recruitment",
        "Aerospace project management placement",
        "Safety-critical systems specialist recruitment"
      ]
    },
    stats: {
      title: "Our Aerospace Recruitment Stats",
      items: [
        { number: "1,500+", label: "Aerospace Engineers in Network" },
        { number: "50+", label: "Aerospace Companies Served" },
        { number: "96%", label: "Placement Success Rate" },
        { number: "3-5 weeks", label: "Average Placement Time" },
        { number: "100%", label: "Certification Verification" }
      ]
    },
    faq: [
      {
        question: "What aerospace roles do you recruit for?",
        answer: "We recruit for aerospace engineers, avionics engineers, flight software engineers, systems engineers, structural engineers, propulsion engineers, flight test engineers, and DO-178 certification experts."
      },
      {
        question: "What is DO-178 certification and why is it important?",
        answer: "DO-178 is the software safety standard for airborne systems. We specialize in placing engineers with DO-178 experience, which is critical for flight software development and certification."
      },
      {
        question: "Do you handle both commercial and defense aerospace positions?",
        answer: "Yes, we recruit for both commercial aviation and defense/aerospace positions, understanding the unique requirements and security clearances needed for each."
      },
      {
        question: "What technical skills do you look for in aerospace candidates?",
        answer: "We look for expertise in avionics, embedded systems, flight software, systems integration, validation and verification, safety-critical systems, and aerospace-specific tools and standards."
      },
      {
        question: "How do you verify aerospace engineering credentials?",
        answer: "We verify engineering degrees, professional licenses, certifications, security clearances, and previous aerospace project experience through comprehensive background checks."
      }
    ]
  },
  automotive: {
    slug: "automotive",
    title: "Automotive & EV Recruitment",
    hero: {
      title: "Automotive & EV Talent Solutions",
      subtitle: "Connecting automotive companies with EV and automotive engineering talent",
      description: "We specialize in placing automotive engineers, EV specialists, and ADAS experts for the future of mobility.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Automotive",
      description: "Venus Consultancy is a leading automotive recruitment firm specializing in electric vehicles, autonomous driving, and traditional automotive engineering. We understand the transformation happening in the automotive industry.",
      points: [
        "Specialized automotive and EV recruitment",
        "Network of automotive engineers and EV specialists",
        "ADAS and autonomous vehicle expertise",
        "Partnerships with major automotive OEMs and suppliers"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Automotive recruitment, especially in EV and autonomous vehicles, requires understanding of cutting-edge technology and industry transformation.",
      benefits: [
        {
          title: "EV Expertise",
          description: "Specialized knowledge in battery technology, charging systems, and electric vehicle engineering."
        },
        {
          title: "ADAS & Autonomous",
          description: "Deep expertise in advanced driver assistance systems, autonomous vehicle technology, and sensor fusion."
        },
        {
          title: "Industry Transformation",
          description: "Understanding of the shift from traditional automotive to electric and autonomous vehicles."
        },
        {
          title: "Technical Excellence",
          description: "Access to engineers with expertise in embedded systems, automotive software, and vehicle integration."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive automotive recruitment services covering traditional and emerging automotive technologies.",
      services: [
        "EV battery and powertrain engineer placement",
        "ADAS and autonomous vehicle engineer recruitment",
        "Embedded software and automotive software placement",
        "Mechanical and vehicle integration engineer recruitment",
        "FuSa (Functional Safety) and cybersecurity specialist placement",
        "Infotainment and HMI engineer recruitment",
        "Automotive testing and validation engineer placement",
        "Automotive project management recruitment"
      ]
    },
    stats: {
      title: "Our Automotive Recruitment Stats",
      items: [
        { number: "2,000+", label: "Automotive Engineers in Network" },
        { number: "75+", label: "Automotive Companies Served" },
        { number: "94%", label: "Placement Success Rate" },
        { number: "2-4 weeks", label: "Average Placement Time" },
        { number: "30%", label: "EV & Autonomous Specialists" }
      ]
    },
    faq: [
      {
        question: "What automotive roles do you recruit for?",
        answer: "We recruit for EV engineers, battery engineers, ADAS engineers, autonomous vehicle engineers, embedded software engineers, mechanical engineers, automotive test engineers, and FuSa/cybersecurity specialists."
      },
      {
        question: "What is FuSa and why is it important in automotive?",
        answer: "FuSa (Functional Safety) ensures automotive systems operate safely. We specialize in placing FuSa engineers who are critical for safety-critical automotive systems, especially in autonomous vehicles."
      },
      {
        question: "Do you handle both traditional and EV automotive positions?",
        answer: "Yes, we recruit for both traditional automotive engineering roles and emerging EV, autonomous, and connected vehicle positions."
      },
      {
        question: "What technical skills are most in demand in automotive?",
        answer: "Currently, the highest demand is for EV battery technology, ADAS/autonomous systems, embedded software, automotive cybersecurity, and vehicle integration expertise."
      },
      {
        question: "How do you assess automotive engineering candidates?",
        answer: "We use technical assessments, automotive-specific case studies, embedded systems testing, and in-depth interviews with automotive engineering experts to evaluate candidates."
      }
    ]
  },
  pharmaceutical: {
    slug: "pharmaceutical",
    title: "Pharmaceutical & Life Science Recruitment",
    hero: {
      title: "Pharmaceutical Talent Excellence",
      subtitle: "Connecting pharma companies with life science professionals",
      description: "We specialize in placing pharmaceutical professionals, from R&D scientists to regulatory affairs experts, ensuring compliance and innovation.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Pharmaceuticals",
      description: "Venus Consultancy is a specialized pharmaceutical recruitment firm with deep expertise in life sciences, clinical research, and regulatory affairs. We understand the unique requirements of the pharmaceutical industry.",
      points: [
        "Specialized pharmaceutical and life science recruitment",
        "Network of pharmaceutical professionals",
        "Regulatory affairs and compliance expertise",
        "Partnerships with pharma companies and CROs"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Pharmaceutical recruitment requires understanding of regulatory requirements, clinical research, and the scientific expertise needed for drug development.",
      benefits: [
        {
          title: "Regulatory Expertise",
          description: "Deep understanding of FDA, Health Canada, and international regulatory requirements for pharmaceutical operations."
        },
        {
          title: "Scientific Excellence",
          description: "Access to PhD-level scientists, clinical researchers, and pharmaceutical professionals with verified credentials."
        },
        {
          title: "Compliance Focus",
          description: "All candidates are screened for regulatory compliance knowledge and GMP/GCP understanding."
        },
        {
          title: "Quick Placement",
          description: "Average placement time of 2-3 weeks to fill critical pharmaceutical roles quickly."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive pharmaceutical recruitment services covering all aspects of drug development and commercialization.",
      services: [
        "Clinical research and clinical trials professional placement",
        "Regulatory affairs specialist recruitment",
        "Pharmaceutical sales and marketing placement",
        "Quality control and quality assurance recruitment",
        "Laboratory support and analytical chemist placement",
        "Supply chain and logistics recruitment",
        "Business development and partnership placement",
        "Pharmaceutical legal and compliance recruitment"
      ]
    },
    stats: {
      title: "Our Pharmaceutical Recruitment Stats",
      items: [
        { number: "2,500+", label: "Pharmaceutical Professionals" },
        { number: "100+", label: "Pharma Companies Served" },
        { number: "93%", label: "Placement Success Rate" },
        { number: "2-3 weeks", label: "Average Placement Time" },
        { number: "100%", label: "Regulatory Compliance Verified" }
      ]
    },
    faq: [
      {
        question: "What pharmaceutical roles do you recruit for?",
        answer: "We recruit for clinical research associates, regulatory affairs specialists, pharmaceutical sales representatives, quality control analysts, laboratory technicians, supply chain managers, business development managers, and pharmaceutical legal professionals."
      },
      {
        question: "Do you verify regulatory compliance knowledge?",
        answer: "Yes, we verify candidates' understanding of FDA regulations, Health Canada requirements, GMP, GCP, and other pharmaceutical regulatory standards."
      },
      {
        question: "What therapeutic areas do you cover?",
        answer: "We cover all therapeutic areas including oncology, cardiology, neurology, immunology, rare diseases, and all other pharmaceutical specialties."
      },
      {
        question: "Do you handle both permanent and contract pharmaceutical positions?",
        answer: "Yes, we provide both permanent and contract/temporary pharmaceutical staffing solutions, including clinical trial support and project-based roles."
      },
      {
        question: "How do you assess pharmaceutical candidates?",
        answer: "We use technical assessments, regulatory knowledge tests, scientific background verification, and in-depth interviews with pharmaceutical industry experts."
      }
    ]
  },
  manufacturing: {
    slug: "manufacturing",
    title: "Manufacturing & Skilled Trades Recruitment",
    hero: {
      title: "Manufacturing Talent Solutions",
      subtitle: "Connecting manufacturers with skilled trades and engineering professionals",
      description: "We specialize in placing manufacturing engineers, skilled tradespeople, and production professionals for industrial excellence.",
      backgroundImage: "/Hero-background.png"
    },
    whoAreWe: {
      title: "Who We Are in Manufacturing",
      description: "Venus Consultancy is a leading manufacturing recruitment firm with expertise in industrial operations, skilled trades, and manufacturing engineering. We understand the operational demands of manufacturing facilities.",
      points: [
        "Specialized manufacturing and skilled trades recruitment",
        "Network of manufacturing professionals and tradespeople",
        "Lean Six Sigma and process improvement expertise",
        "Partnerships with manufacturers across all industries"
      ]
    },
    whyYouNeedUs: {
      title: "Why You Need Us",
      description: "Manufacturing recruitment requires understanding of industrial operations, safety standards, and the technical skills needed for production excellence.",
      benefits: [
        {
          title: "Skilled Trades Expertise",
          description: "Access to certified tradespeople including welders, machinists, electricians, and industrial mechanics."
        },
        {
          title: "Process Excellence",
          description: "Specialized knowledge in Lean Six Sigma, continuous improvement, and manufacturing best practices."
        },
        {
          title: "Safety Focus",
          description: "All candidates are screened for safety certifications and industrial safety knowledge."
        },
        {
          title: "Quick Deployment",
          description: "Average placement time of 1-2 weeks to fill critical manufacturing roles quickly."
        }
      ]
    },
    whatWeCanDo: {
      title: "What We Can Do For You",
      description: "Comprehensive manufacturing recruitment services covering all production and operational roles.",
      services: [
        "Manufacturing engineer and production engineer placement",
        "Skilled trades recruitment (welders, machinists, electricians)",
        "Supply chain and logistics professional placement",
        "Quality control and quality assurance recruitment",
        "Maintenance and facilities management placement",
        "Lean Six Sigma and process improvement recruitment",
        "Production supervisor and manager placement",
        "Warehouse and distribution recruitment"
      ]
    },
    stats: {
      title: "Our Manufacturing Recruitment Stats",
      items: [
        { number: "4,000+", label: "Manufacturing Professionals" },
        { number: "300+", label: "Manufacturing Companies Served" },
        { number: "91%", label: "Placement Success Rate" },
        { number: "1-2 weeks", label: "Average Placement Time" },
        { number: "100%", label: "Safety Certification Verified" }
      ]
    },
    faq: [
      {
        question: "What manufacturing roles do you recruit for?",
        answer: "We recruit for manufacturing engineers, production supervisors, skilled tradespeople (welders, machinists, electricians, mechanics), quality control analysts, supply chain managers, maintenance technicians, and warehouse operators."
      },
      {
        question: "Do you verify trade certifications?",
        answer: "Yes, we verify all trade certifications, licenses, and safety credentials including welding certifications, electrical licenses, and industrial safety training."
      },
      {
        question: "What industries do you serve in manufacturing?",
        answer: "We serve automotive manufacturing, aerospace manufacturing, food and beverage, pharmaceuticals, consumer goods, industrial equipment, and all other manufacturing sectors."
      },
      {
        question: "Do you handle both permanent and temporary manufacturing positions?",
        answer: "Yes, we provide both permanent and temporary/contract manufacturing staffing solutions to meet production demands and seasonal needs."
      },
      {
        question: "How do you assess manufacturing candidates?",
        answer: "We use technical skills assessments, hands-on testing for tradespeople, safety knowledge verification, and in-depth interviews with manufacturing industry experts."
      }
    ]
  }
};

// Helper function to get industry by slug
export const getIndustryBySlug = (slug) => {
  return industryData[slug] || null;
};

// Get all industry slugs
export const getAllIndustrySlugs = () => {
  return Object.keys(industryData);
};

