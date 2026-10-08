// Landing page — hero + feature highlights, matching the login page's visual language.
// File: frontend/app/page.tsx

"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="page">
      <span className="glyph g1" aria-hidden="true">🌾</span>
      <span className="glyph g2" aria-hidden="true">🌱</span>
      <span className="glyph g3" aria-hidden="true">🚜</span>

      <section className="hero">
        <div className="badge">Infosys Internship Project</div>
        <div className="logo">🌾 YieldSense AI</div>
        <h1 className="headline">Smart farming decisions start here.</h1>
        <p className="subhead">
          Data-driven crop yield predictions and productivity forecasting — built for farmers,
          cooperatives, agribusinesses, and government officers.
        </p>

        <div className="ctaRow">
          <button className="primaryBtn" onClick={() => router.push("/onboarding")}>
            Get Started 🚜
          </button>
          <button className="secondaryBtn" onClick={() => router.push("/login")}>
            Log In
          </button>
        </div>
      </section>

      <section className="features">
        <div className="featureCard">
          <span className="featureIcon">📈</span>
          <h3>Yield Forecasting</h3>
          <p>Predictions grounded in historical FAOSTAT, USDA, and district-level data.</p>
        </div>
        <div className="featureCard">
          <span className="featureIcon">💧</span>
          <h3>Weather-Aware</h3>
          <p>Recommendations that adapt to your region's climate patterns.</p>
        </div>
        <div className="featureCard">
          <span className="featureIcon">🌱</span>
          <h3>Soil & Season Insights</h3>
          <p>Guidance tailored to your crop, season, and soil profile.</p>
        </div>
      </section>

      <style jsx>{`
        .page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          background: #f7f9f6;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .glyph {
          position: absolute;
          font-size: 10rem;
          opacity: 0.06;
          user-select: none;
          pointer-events: none;
        }
        .g1 { top: -3rem; left: -3rem; transform: rotate(-15deg); }
        .g2 { top: 20%; right: -4rem; transform: rotate(20deg); font-size: 8rem; }
        .g3 { bottom: -2rem; left: 8%; transform: rotate(-10deg); font-size: 7rem; }

        .hero {
          position: relative;
          z-index: 1;
          max-width: 640px;
          text-align: center;
          padding: 6rem 2rem 3rem;
        }
        .badge {
          display: inline-block;
          background: #e8f5e9;
          color: #1b5e20;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.5s ease both;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1b5e20;
          margin-bottom: 1rem;
          animation: fadeInUp 0.5s ease 0.05s both;
        }
        .headline {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.2;
          margin: 0 0 1rem;
          animation: fadeInUp 0.5s ease 0.1s both;
        }
        .subhead {
          font-size: 1.05rem;
          color: #5f6368;
          line-height: 1.6;
          margin: 0 0 2.5rem;
          animation: fadeInUp 0.5s ease 0.15s both;
        }
        .ctaRow {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.5s ease 0.2s both;
        }
        .primaryBtn {
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: #fff;
          border: none;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .primaryBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(27, 94, 32, 0.32);
        }
        .secondaryBtn {
          background: #ffffff;
          color: #1a1a1a;
          border: 1px solid #e0e0e0;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .secondaryBtn:hover {
          border-color: #2e7d32;
          transform: translateY(-2px);
        }

        .features {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 960px;
          padding: 1rem 2rem 5rem;
        }
        .featureCard {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(26, 26, 26, 0.06);
          padding: 2rem 1.5rem;
          width: 260px;
          text-align: center;
          animation: fadeInUp 0.5s ease 0.3s both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .featureCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(27, 94, 32, 0.14);
        }
        .featureIcon {
          font-size: 2.25rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .featureCard h3 {
          margin: 0 0 0.5rem;
          font-size: 1.05rem;
          color: #1a1a1a;
        }
        .featureCard p {
          margin: 0;
          font-size: 0.9rem;
          color: #5f6368;
          line-height: 1.5;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .headline { font-size: 1.9rem; }
          .hero { padding: 4rem 1.25rem 2rem; }
        }
      `}</style>
    </main>
  );
}