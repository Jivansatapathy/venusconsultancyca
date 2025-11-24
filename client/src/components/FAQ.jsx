// client/src/components/FAQ.jsx
import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What areas in Canada does Venus Hiring serve?",
      answer: "Venus Hiring serves businesses and professionals across all of Canada, from coast to coast. Our headquarters in Toronto allows us to effectively serve major cities including Vancouver, Montreal, Calgary, Ottawa, Edmonton, Winnipeg, Halifax, and beyond. We have deep knowledge of the Canadian job market and can help with placements in any province or territory."
    },
    {
      question: "Do you help with work permits and immigration for international candidates?",
      answer: "Yes, we assist Canadian employers in navigating the immigration process for international talent. While we're not immigration lawyers, we work closely with immigration consultants and can guide you through the LMIA (Labour Market Impact Assessment) process, work permit applications, and permanent residency pathways. Our team understands Canadian immigration requirements and can help connect you with qualified candidates who are eligible to work in Canada."
    },
    {
      question: "What industries do you specialize in within the Canadian market?",
      answer: "We specialize in recruiting for a wide range of industries across Canada, including Technology, Healthcare, Finance, Engineering, Skilled Trades, Manufacturing, Retail, and Professional Services. Our expertise spans from entry-level positions to C-suite executive roles, with particular strength in sectors that are thriving in major Canadian cities like Toronto, Vancouver, and Montreal."
    },
    {
      question: "How does your recruitment process work for Canadian companies?",
      answer: "Our process is tailored to the Canadian market. We begin by understanding your specific needs, company culture, and the Canadian market context. We then source candidates from our extensive network across Canada, screen them thoroughly, and present you with qualified shortlists. We handle everything from initial interviews to reference checks, ensuring candidates understand Canadian workplace expectations and are ready to contribute to your team."
    },
    {
      question: "What makes Venus Hiring different from other Canadian recruitment agencies?",
      answer: "As a Toronto-based firm with deep roots across Canada, we combine local market knowledge with modern recruitment technology. We understand the unique dynamics of the Canadian job market, including regional differences, bilingual requirements (English/French), and Canadian workplace culture. Our personalized approach, combined with our extensive network of Canadian professionals, allows us to make better matches faster."
    },
    {
      question: "Do you help candidates relocate within Canada?",
      answer: "Yes, we assist candidates with relocations across Canada. Whether you're moving from Vancouver to Toronto, Montreal to Calgary, or any other Canadian city, we can help connect you with opportunities and provide guidance on the relocation process. Many of our clients value candidates who are willing to relocate within Canada, and we facilitate these transitions."
    },
    {
      question: "What are your fees for Canadian employers?",
      answer: "Our fee structure is competitive and transparent, tailored to the Canadian market. Fees are typically based on a percentage of the candidate's first-year salary and vary depending on the role level and industry. We offer flexible payment terms and only charge fees when we successfully place a candidate. Contact us for a customized quote based on your specific hiring needs."
    },
    {
      question: "How quickly can you fill positions for Canadian companies?",
      answer: "Our average time-to-fill varies by role and industry, but we typically present qualified candidates within 1-2 weeks of engagement. For urgent positions, we can expedite the process. Our deep network of Canadian professionals and understanding of the local market allows us to move quickly while maintaining quality standards."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-container">
        <div className="faq-header">
          <h2 id="faq-heading" className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about working with Venus Hiring in Canada</p>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`faq-answer ${openIndex === index ? 'open' : ''}`}
                aria-hidden={openIndex !== index}
              >
                <p className="faq-answer-text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

