// client/src/components/WhyStats.jsx
import React from "react";
import "./WhyStats.css";

const WhyStats = () => {
  const cards = [
    {
      title: 'Human-Centered Approach',
      summary: 'Beyond algorithms, human insight',
      description: 'Every candidate and employer is carefully evaluated through our human-led process, going beyond algorithms to assess personality, skills, and cultural fit. We leverage data-driven insights to ensure the right match — combining precision with the human touch that machines cannot replicate.'
    },
    {
      title: 'Comprehensive Talent Solutions',
      summary: 'End-to-end recruitment across industries',
      description: 'We provide end-to-end recruitment services across IT, Engineering, Scientific, Skilled Trades, Light Industrial, Office & Clerical, Technical Support, Outsourcing, and Recruitment Process Outsourcing. Additionally, we specialize in Executive and Board-level recruitment.'
    },
    {
      title: 'Quality & Integrity',
      summary: 'Ethical excellence, guaranteed success',
      description: 'We take responsibility for placing candidates with strong social, ethical, and professional skills, ensuring they are fully prepared for interviews and workplace success.'
    },
    {
      title: 'Canadian Market Expertise',
      summary: 'Deep local knowledge, nationwide reach',
      description: 'With our headquarters in Toronto and deep roots across Canada, we understand the unique dynamics of the Canadian job market. We connect Canadian talent with opportunities from coast to coast, supporting professionals across all provinces and helping employers access the best talent throughout Canada.'
    }
  ];

  return (
    <section className="vh-why u-container" aria-labelledby="why-heading">
      <div className="vh-why__inner">
        <div className="vh-why__header">
          <h2 id="why-heading" className="vh-why__heading">Why Choose Venus Consultancy?</h2>
        </div>

        <div className="vh-why__cards">
          {cards.map((card, idx) => (
            <div className="vh-why__card" key={card.title}>
              <div className="vh-why__card-header">
                <img
                  src={idx === 1 ? "/iconanimated/union.gif" : "/iconanimated/algorithm.gif"}
                  alt=""
                  className="vh-why__card-icon"
                  loading="lazy"
                />
                <h3 className="vh-why__card-title">{card.title}</h3>
                <div className="vh-why__card-underline"></div>
              </div>
              <div className="vh-why__card-content">
                <p className="vh-why__card-description">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStats;
