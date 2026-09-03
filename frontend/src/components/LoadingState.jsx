import React from 'react';

export default function LoadingState({ message = "Wandering into today's moments..." }) {
  return (
    <div className="loading-container">
      <div className="loading-cloud-wrap">
        <svg viewBox="0 0 64 64" width="64" height="64" className="loading-cloud" fill="none">
          <circle cx="32" cy="32" r="18" fill="#FFD043" opacity="0.4" className="pulse-soft" />
          <path
            d="M44 42H20C15.5817 42 12 38.4183 12 34C12 29.9176 15.0594 26.5492 19.0276 26.0706C20.2534 20.5213 25.2357 16.4 31.2 16.4C38.2692 16.4 44 22.1308 44 29.2C44 29.4754 43.9913 29.7487 43.9742 30.0197C46.3046 31.0344 47.9351 33.3276 47.9969 36.0232C48.0696 39.2377 45.5493 42 42.3333 42Z"
            fill="#FFFFFF"
            stroke="#2B2825"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="loading-text">{message}</p>

      <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }

        .loading-cloud-wrap {
          animation: floatGentle 3s ease-in-out infinite;
          margin-bottom: 20px;
        }

        .loading-text {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--ink-medium);
        }
      `}</style>
    </div>
  );
}
