import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTodayCount, createPost } from '../api/client';

const MAX_TEXT_LENGTH = 500;
const MAX_USERNAME_LENGTH = 30;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ShareDayPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');

  // Quota & Submission State
  const [quota, setQuota] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successPost, setSuccessPost] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Load current quota
  const loadQuota = async () => {
    try {
      setLoadingQuota(true);
      const data = await getTodayCount();
      setQuota(data);
    } catch (err) {
      console.warn('Failed to load quota count:', err);
      // Backend may be offline or unreachable; default safe fallback
      setQuota(null);
    } finally {
      setLoadingQuota(false);
    }
  };

  useEffect(() => {
    loadQuota();
  }, []);

  const isQuotaFull = quota && quota.photosRemaining === 0;

  // Handle Photo File Selection & Client Validation
  const processSelectedFile = (file) => {
    setErrorMessage(null);

    if (!file) return;

    if (isQuotaFull) {
      setErrorMessage("Today's photo limit has been reached. You can still leave a text-only moment.");
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage("Please choose a JPEG, PNG, or WebP photo.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Photo exceeds the maximum allowed size of 50MB.");
      return;
    }

    // Revoke previous preview URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isQuotaFull) return;

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isQuotaFull) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhotoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Prevent duplicate submission
    if (isSubmitting) return;

    setErrorMessage(null);

    // Rule: Must have photo or text
    const trimmedText = text.trim();
    if (!photoFile && !trimmedText) {
      setErrorMessage("Please add a photo or write a thought to share your moment.");
      return;
    }

    // Rule: Text limit
    if (trimmedText.length > MAX_TEXT_LENGTH) {
      setErrorMessage(`Text must not exceed ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    // Rule: Username limit
    const trimmedUsername = username.trim();
    if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
      setErrorMessage(`Username must not exceed ${MAX_USERNAME_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPost({
        photo: photoFile,
        text: trimmedText,
        username: trimmedUsername || undefined,
      });

      setSuccessPost(response);

      // Clean up preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      if (err.status === 409) {
        setErrorMessage(
          "Today's photo limit has been reached. You can still leave a text-only moment."
        );
        // Refresh quota state
        loadQuota();
      } else if (err.status === 502) {
        setErrorMessage("We couldn't save your moment right now. Please try again.");
      } else if (err.status === 400) {
        setErrorMessage(err.message || "Invalid post data. Please check your inputs.");
      } else if (err.status === 500) {
        setErrorMessage("Something went wrong. Please try again later.");
      } else {
        setErrorMessage(
          err.message || "Network error: unable to reach Daily Wander. Please check your connection."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation View
  if (successPost) {
    return (
      <main className="share-page">
        <div className="container">
          <section className="share-card-container success-card card-enter">
            <div className="washi-tape" aria-hidden="true" />
            
            <div className="success-icon" aria-hidden="true">✨</div>

            <h1 className="success-title">YOUR MOMENT IS OUT THERE.</h1>

            <div className="success-body">
              <p>Someone might wander into your day.</p>
              <p className="handwritten success-handwritten">
                But tomorrow... it's gone.
              </p>
            </div>

            <div className="success-actions">
              <Link to="/wander" className="btn btn-sun">
                Wander into today &rarr;
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSuccessPost(null);
                  setText('');
                  setUsername('');
                  setPhotoFile(null);
                  loadQuota();
                }}
              >
                Share another moment
              </button>
            </div>
          </section>
        </div>

        <style>{`
          .success-card {
            text-align: center;
            padding: 60px 36px;
          }
          .success-icon {
            font-size: 3.5rem;
            margin-bottom: 16px;
            animation: pulseSoft 3s ease-in-out infinite;
          }
          .success-title {
            font-size: 2.2rem;
            color: var(--ink-dark);
            margin-bottom: 16px;
            letter-spacing: 0.02em;
          }
          .success-body {
            font-size: 1.15rem;
            color: var(--ink-medium);
            margin-bottom: 36px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .success-handwritten {
            font-size: 1.6rem;
            color: var(--ink-dark);
          }
          .success-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="share-page">
      <div className="container">
        <section className="share-card-container card-enter">
          <div className="washi-tape" aria-hidden="true" />

          <header className="share-header">
            {/* Daily Quota Indicator */}
            {quota && (
              <div className={`quota-pill ${isQuotaFull ? 'quota-full' : ''}`}>
                <span>
                  📸 {quota.photosToday} / {quota.photoLimit} photo moments shared today
                </span>
                {!isQuotaFull ? (
                  <span className="quota-remaining">
                    &bull; {quota.photosRemaining} {quota.photosRemaining === 1 ? 'spot' : 'spots'} left
                  </span>
                ) : (
                  <span className="quota-remaining">&bull; full for today</span>
                )}
              </div>
            )}

            <h1 className="share-title">SHARE YOUR DAY</h1>
            <p className="share-subtitle">What did today look like?</p>

            {isQuotaFull && (
              <div className="quota-notice">
                <span>
                  Today's photo limit is reached. You can still leave a text-only moment!
                </span>
              </div>
            )}
          </header>

          {/* Form */}
          <form className="share-form" onSubmit={handleSubmit}>
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              id="photo-file-input"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              disabled={isSubmitting || isQuotaFull}
            />

            {/* Photo Picker or Active Preview */}
            {!previewUrl ? (
              <div
                className={`photo-dropzone ${isDragging ? 'dragging' : ''} ${isQuotaFull ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (!isQuotaFull && !isSubmitting && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                role="button"
                tabIndex={isQuotaFull ? -1 : 0}
                aria-label="Add a photo"
              >
                <div className="dropzone-inner">
                  <div className="camera-icon">{isQuotaFull ? '🔒' : '📷'}</div>
                  <h3 className="dropzone-title">
                    {isQuotaFull ? 'Photo quota reached' : '✦ Leave a photo from today'}
                  </h3>
                  <p className="dropzone-hint">
                    {isQuotaFull
                      ? 'Share a text-only reflection below'
                      : 'Choose a moment from your day (JPEG, PNG, WebP up to 50MB)'}
                  </p>
                </div>
              </div>
            ) : (
              /* Photo Preview State */
              <div className="photo-preview-wrap">
                <div className="photo-preview-container">
                  <img
                    src={previewUrl}
                    alt="Selected moment preview"
                    className="photo-preview-img"
                  />
                </div>
                <div className="preview-controls">
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    disabled={isSubmitting}
                  >
                    Change photo
                  </button>
                  <span className="dot-sep">&bull;</span>
                  <button
                    type="button"
                    className="btn-link text-danger"
                    onClick={handleRemovePhoto}
                    disabled={isSubmitting}
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            )}

            {/* Reflection Text Area */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="reflection-input" className="form-label">
                  Tell us about it...
                </label>
                <span className={`char-counter ${text.length >= 480 ? 'counter-warn' : ''}`}>
                  {text.length} / {MAX_TEXT_LENGTH}
                </span>
              </div>
              <textarea
                id="reflection-input"
                className="form-textarea"
                rows="4"
                maxLength={MAX_TEXT_LENGTH}
                placeholder="A few words about what made this moment yours..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Username Field */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="name-input" className="form-label">
                  Your name
                </label>
                <span className="char-counter">
                  {username.length} / {MAX_USERNAME_LENGTH}
                </span>
              </div>
              <input
                id="name-input"
                type="text"
                className="form-input"
                maxLength={MAX_USERNAME_LENGTH}
                placeholder="Anonymous"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="form-error-banner card-enter" role="alert">
                <span className="error-icon-small">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-sun btn-share"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sharing...' : 'Share your day ✨'}
              </button>
            </div>
          </form>

          <footer className="share-note">
            <span className="handwritten">
              Everything shared today gently disappears when the clock strikes midnight.
            </span>
          </footer>
        </section>
      </div>

      <style>{`
        .share-page {
          padding: 40px 0 90px 0;
          display: flex;
          justify-content: center;
        }

        .share-card-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          background: var(--paper-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-polaroid);
          padding: 40px 36px;
          border: 1px solid rgba(43, 40, 37, 0.07);
        }

        .share-header {
          text-align: center;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .quota-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: var(--radius-full);
          background: var(--sun-yellow-soft);
          color: var(--ink-dark);
          border: 1px solid rgba(255, 208, 67, 0.5);
        }

        .quota-pill.quota-full {
          background: #FEECEB;
          color: #B23B2A;
          border-color: rgba(178, 59, 42, 0.3);
        }

        .quota-remaining {
          color: var(--ink-medium);
        }

        .quota-notice {
          background: #FFFDF4;
          border-left: 4px solid var(--sun-yellow);
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.95rem;
          color: var(--ink-dark);
          margin-top: 4px;
        }

        .share-title {
          font-size: 2.4rem;
          color: var(--ink-dark);
          letter-spacing: 0.02em;
        }

        .share-subtitle {
          font-size: 1.15rem;
          color: var(--ink-medium);
        }

        .share-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .photo-dropzone {
          border: 2px dashed rgba(43, 40, 37, 0.22);
          border-radius: var(--radius-sm);
          background: var(--bg-canvas-subtle);
          padding: 36px 20px;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .photo-dropzone:hover:not(.disabled) {
          border-color: var(--ink-dark);
          background: #FFFDF4;
        }

        .photo-dropzone.dragging {
          border-color: #E85D04;
          background: #FFF5E6;
        }

        .photo-dropzone.disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .camera-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .dropzone-title {
          font-size: 1.25rem;
          color: var(--ink-dark);
          margin-bottom: 4px;
        }

        .dropzone-hint {
          font-size: 0.92rem;
          color: var(--ink-light);
        }

        /* Photo Preview */
        .photo-preview-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .photo-preview-container {
          width: 100%;
          max-height: 380px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #000;
          box-shadow: var(--shadow-polaroid);
        }

        .photo-preview-img {
          width: 100%;
          max-height: 380px;
          object-fit: contain;
          display: block;
        }

        .preview-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-heading);
          font-size: 0.95rem;
        }

        .btn-link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          color: var(--ink-dark);
          text-decoration: underline;
          padding: 4px;
        }

        .btn-link:hover {
          color: #E85D04;
        }

        .text-danger {
          color: #B23B2A;
        }

        .text-danger:hover {
          color: #E63946;
        }

        .dot-sep {
          color: var(--ink-faint);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .form-label {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink-dark);
        }

        .char-counter {
          font-family: var(--font-handwritten);
          font-size: 1.15rem;
          color: var(--ink-light);
        }

        .counter-warn {
          color: #D90429;
          font-weight: 700;
        }

        .form-input, .form-textarea {
          font-family: var(--font-body);
          font-size: 1rem;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border: 1.5px solid rgba(43, 40, 37, 0.15);
          background: #FAF7F2;
          color: var(--ink-dark);
          transition: border-color 0.2s ease, background-color 0.2s ease;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: var(--ink-dark);
          background: var(--paper-white);
        }

        .form-textarea {
          resize: vertical;
        }

        .form-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #FFF2F0;
          border: 1px solid #F5C2BA;
          border-radius: var(--radius-sm);
          color: #B23B2A;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 6px;
        }

        .btn-share {
          width: 100%;
          padding: 14px 28px;
        }

        .btn-share:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .share-note {
          margin-top: 26px;
          text-align: center;
          padding-top: 18px;
          border-top: 1px dashed rgba(43, 40, 37, 0.12);
        }

        .share-note span {
          color: var(--ink-light);
          font-size: 1.25rem;
        }
      `}</style>
    </main>
  );
}
