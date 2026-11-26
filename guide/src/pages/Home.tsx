import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout';
import { siteConfig, semesterInfo } from '@/data/siteConfig';
import '@/styles/home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="home-hero">
          <div className="home-hero-content">
            <div className="home-badge">{siteConfig.courseNameEn}</div>
            <div className="home-semester">
              {semesterInfo}
            </div>

            <h1 className="home-title">
              {siteConfig.university}
              <br />
              <span className="home-title-highlight">
                {siteConfig.courseName}
              </span>
            </h1>

            <p className="home-subtitle">
              {siteConfig.courseDescription}
            </p>

            <button
              className="home-cta-button"
              onClick={() => navigate('/dashboard')}
            >
              <span>실습 시작하기</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="home-features">
              {siteConfig.homeFeatures.map((feature, idx) => (
                <div key={idx} className="home-feature">
                  <div className="home-feature-icon">{feature.icon}</div>
                  <div className="home-feature-text">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer variant="light" />
    </div>
  );
};
