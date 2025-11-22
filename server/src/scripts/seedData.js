// server/src/scripts/seedData.js
import { config } from "../config/index.js";
import Admin from "../models/Admin.js";
import Recruiter from "../models/Recruiter.js";
import Job from "../models/Job.js";
import SEO from "../models/SEO.js";
import Blog from "../models/Blog.js";
import connectDB from "../config/db.js";

const seedData = async () => {
  try {
    // Validate required environment variables for seeding
    if (!config.SEED_ADMIN_PASSWORD) {
      console.error("❌ CRITICAL SECURITY ERROR: SEED_ADMIN_PASSWORD is not configured!");
      console.error("🚨 For security reasons, seed scripts require explicit password configuration.");
      console.error("Please set SEED_ADMIN_PASSWORD environment variable before running seed script.");
      process.exit(1);
    }

    if (!config.SEED_RECRUITER_PASSWORD) {
      console.error("❌ CRITICAL SECURITY ERROR: SEED_RECRUITER_PASSWORD is not configured!");
      console.error("🚨 For security reasons, seed scripts require explicit password configuration.");
      console.error("Please set SEED_RECRUITER_PASSWORD environment variable before running seed script.");
      process.exit(1);
    }

    await connectDB();
    console.log("Connected to Firestore");

    // Clear existing data
    await Admin.deleteAll();
    await Recruiter.deleteAll();
    await Job.deleteAll();
    console.log("Cleared existing data");

    // Create Admin (password will be hashed by create function)
    const admin = await Admin.create({
      name: "System Administrator",
      email: "admin@venusconsultancy.com",
      password: config.SEED_ADMIN_PASSWORD, // Will be hashed by create function
      role: "admin"
    });
    console.log("✅ Created admin user: admin@venusconsultancy.com");

    // Create Recruiter (password will be hashed by create function)
    const recruiter = await Recruiter.create({
      name: "John Recruiter",
      email: "recruiter@venusconsultancy.com",
      password: config.SEED_RECRUITER_PASSWORD, // Will be hashed by create function
      role: "recruiter"
    });
    console.log("✅ Created recruiter user: recruiter@venusconsultancy.com");

    // Create sample jobs
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-Time",
        description: "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building user-facing features and ensuring the best user experience across our web applications.",
        tags: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Frontend"],
        isActive: true
      },
      {
        title: "Backend Developer",
        department: "Engineering",
        location: "New York, NY",
        type: "Full-Time",
        description: "Join our backend team to build scalable and robust server-side applications. You'll work with modern technologies and contribute to our growing platform.",
        tags: ["Node.js", "Python", "MongoDB", "PostgreSQL", "API Development", "Backend"],
        isActive: true
      },
      {
        title: "UX/UI Designer",
        department: "Design",
        location: "San Francisco, CA",
        type: "Full-Time",
        description: "We're seeking a creative UX/UI Designer to help shape the user experience of our products. You'll work closely with product managers and developers to create intuitive and beautiful interfaces.",
        tags: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems", "UX"],
        isActive: true
      },
      {
        title: "Marketing Specialist",
        department: "Marketing",
        location: "Chicago, IL",
        type: "Full-Time",
        description: "Looking for a Marketing Specialist to drive our digital marketing initiatives. You'll be responsible for content creation, social media management, and campaign execution.",
        tags: ["Digital Marketing", "Social Media", "Content Creation", "SEO", "Analytics", "Marketing"],
        isActive: true
      },
      {
        title: "Data Analyst",
        department: "Analytics",
        location: "Austin, TX",
        type: "Full-Time",
        description: "Join our analytics team to help drive data-driven decisions. You'll work with large datasets, create reports, and provide insights to support business growth.",
        tags: ["SQL", "Python", "R", "Tableau", "Statistics", "Data Analysis"],
        isActive: true
      },
      {
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Seattle, WA",
        type: "Full-Time",
        description: "We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You'll work with cloud technologies and automation tools.",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure", "DevOps"],
        isActive: true
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "Boston, MA",
        type: "Full-Time",
        description: "Looking for a Product Manager to lead product strategy and development. You'll work with cross-functional teams to deliver features that meet user needs.",
        tags: ["Product Strategy", "Agile", "User Stories", "Roadmapping", "Stakeholder Management", "Product"],
        isActive: true
      },
      {
        title: "Sales Representative",
        department: "Sales",
        location: "Miami, FL",
        type: "Full-Time",
        description: "Join our sales team to help grow our business. You'll be responsible for building relationships with clients and driving revenue growth.",
        tags: ["Sales", "CRM", "Lead Generation", "Client Relations", "Negotiation", "Business Development"],
        isActive: true
      },
      {
        title: "Software Engineering Intern",
        department: "Engineering",
        location: "Remote",
        type: "Internship",
        description: "Great opportunity for students to gain real-world experience in software development. You'll work on actual projects and learn from experienced developers.",
        tags: ["Learning", "Mentorship", "Software Development", "Internship", "Growth", "Education"],
        isActive: true
      },
      {
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Denver, CO",
        type: "Full-Time",
        description: "Help our customers succeed by providing excellent support and guidance. You'll work closely with clients to ensure they get the most value from our products.",
        tags: ["Customer Support", "Account Management", "Communication", "Problem Solving", "Client Success", "Support"],
        isActive: true
      }
    ];

    for (const jobData of sampleJobs) {
      await Job.create(jobData);
    }
    console.log(`✅ Created ${sampleJobs.length} sample jobs`);

    // Seed SEO Content with Homepage Content
    const seoContent = {
      // SEO Meta Tags
      siteTitle: "Venus Consultancy - Executive Search & Talent Solutions",
      siteDescription: "Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring. We connect top talent with premier organizations worldwide.",
      siteKeywords: "executive search, talent acquisition, leadership hiring, recruitment, headhunting, C-suite placements, executive recruitment, talent solutions, executive search firm, recruitment agency",
      defaultMetaTitle: "Venus Consultancy - Executive Search & Talent Solutions",
      defaultMetaDescription: "Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring. We connect top talent with premier organizations worldwide.",
      ogTitle: "Venus Consultancy - Executive Search & Talent Solutions",
      ogDescription: "Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring. We connect top talent with premier organizations worldwide.",
      ogImage: "/venuslogo.png",
      twitterCard: "summary_large_image",
      twitterTitle: "Venus Consultancy - Executive Search & Talent Solutions",
      twitterDescription: "Leading executive search and talent acquisition firm specializing in C-suite placements and leadership hiring.",
      twitterImage: "/venuslogo.png",
      // Homepage Content - Hero Section
      heroGreeting: "- Empower Your Workforce -",
      heroTitleLine1: "Shape the Future of",
      heroTitleLine2: "Your Organization Today",
      heroSubtitle: "Connect with top-tier talent across Canada and discover professionals who drive growth, innovation, and success for Canadian businesses.",
      heroButton1Text: "Book a Consultation",
      heroButton1Link: "/book-call",
      heroButton2Text: "Our Services",
      heroButton2Link: "/services",
      // Homepage Content - About Section
      aboutTag: "ABOUT VENUS HIRING",
      aboutTitle: "Driving Success With An Expert Staffing",
      aboutDescription: "At Venus Consultancy, we understand that the key to business success lies in having the right people on your team. As a leading Canadian recruitment firm based in Toronto, we're committed to connecting Canadian companies with exceptional talent across Canada. Our deep understanding of the Canadian job market, from Vancouver to Halifax, enables us to find the perfect match for businesses nationwide.",
      aboutStatClients: 77,
      aboutStatSatisfaction: 98,
      aboutStatSuccess: 99,
      aboutStatClientsLabel: "Trusted Partnerships",
      aboutStatSatisfactionLabel: "Client Satisfaction",
      aboutStatSuccessLabel: "Success Rate",
      aboutCtaText: "JOIN OUR NETWORK",
      aboutCtaLink: "/book-call",
      updatedBy: "system"
    };

    await SEO.upsert(seoContent);
    console.log("✅ Seeded SEO content");

    // Seed Blog Posts
    const sampleBlogs = [
      {
        title: "How to hire remote engineers without wasting time",
        content: `Remote engineering talent is in high demand, and the competition is fierce. Many companies waste weeks or even months in a hiring process that ultimately fails to attract or retain the right candidates. 

In this article, we share a streamlined process for sourcing, interviewing, and onboarding remote engineering talent that actually sticks. We'll cover:

**Sourcing Strategies**
- Where to find quality remote engineers
- How to write job descriptions that attract the right candidates
- Building a talent pipeline before you need to hire

**Interview Process**
- Technical assessments that actually matter
- Cultural fit evaluation for remote teams
- Reference checks that provide real insights

**Onboarding for Success**
- First-week strategies that set remote engineers up for success
- Building connections in a distributed team
- Setting clear expectations and communication channels

By following these proven methods, you can reduce time-to-hire by 40% while improving candidate quality and retention rates.`,
        excerpt: "We share a streamlined process for sourcing, interviewing, and onboarding remote engineering talent that actually sticks.",
        tags: ["Hiring", "Engineering"],
        published: true,
        authorName: "Jivan Satapathy",
        imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop"
      },
      {
        title: "Building an inclusive interview process: practical steps",
        content: `Creating an inclusive interview process isn't just the right thing to do—it's a competitive advantage. Companies with diverse teams perform better, innovate more, and attract top talent. Yet many organizations struggle with unconscious bias in their hiring processes.

This guide provides simple, actionable adjustments to job descriptions, interviewing, and feedback loops that make hiring fairer and more effective:

**Job Description Best Practices**
- Removing biased language and requirements
- Focusing on essential vs. nice-to-have qualifications
- Using inclusive language that welcomes all candidates

**Interview Structure**
- Standardized questions that reduce bias
- Diverse interview panels
- Structured evaluation criteria

**Feedback and Decision-Making**
- Objective scoring rubrics
- Bias training for interviewers
- Data-driven hiring decisions

**Continuous Improvement**
- Tracking diversity metrics
- Regular process audits
- Candidate feedback loops

These practical steps can be implemented immediately and will help you build a more diverse, effective team.`,
        excerpt: "Simple adjustments to job descriptions, interviewing, and feedback loops that make hiring fairer and more effective.",
        tags: ["Diversity", "Recruitment"],
        published: true,
        authorName: "Soumya R.",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop"
      },
      {
        title: "Employer branding for startups: what actually works",
        content: `For startups competing with established companies for talent, employer branding can feel like an impossible challenge. You don't have the budget of Google or the reputation of Microsoft, but you still need to attract top talent.

The good news? Effective employer branding for startups isn't about big budgets—it's about authenticity, storytelling, and strategic positioning. Here's what actually works:

**Employee Storytelling**
- Real stories from your team members
- Behind-the-scenes content that shows your culture
- Authentic social media presence

**Practical Social Proof**
- Glassdoor reviews and ratings
- Employee testimonials
- Case studies of career growth

**Strategic Positioning**
- Highlighting unique opportunities startups offer
- Emphasizing impact and ownership
- Showcasing learning and growth opportunities

**Content Strategy**
- Blog posts that demonstrate thought leadership
- Social media that reflects your culture
- Career pages that tell your story

**Partnerships and Community**
- University partnerships
- Tech community involvement
- Speaking engagements and thought leadership

From employee storytelling to practical social proof, these tactics help early-stage companies attract the right talent without breaking the bank.`,
        excerpt: "From employee storytelling to practical social proof — tactics that help early-stage companies attract the right talent.",
        tags: ["Branding", "Startups"],
        published: true,
        authorName: "Pooja K.",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop"
      }
    ];

    for (const blogData of sampleBlogs) {
      await Blog.create(blogData);
    }
    console.log(`✅ Created ${sampleBlogs.length} sample blog posts`);

    console.log("\n🎉 Seed data created successfully!");
    console.log("\nLogin credentials:");
    console.log("Admin: admin@venusconsultancy.com");
    console.log("Recruiter: recruiter@venusconsultancy.com");
    console.log("\n⚠️  Passwords are securely hashed and stored.");
    console.log("Use the SEED_ADMIN_PASSWORD and SEED_RECRUITER_PASSWORD environment variables to login.");

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seed function
seedData();
