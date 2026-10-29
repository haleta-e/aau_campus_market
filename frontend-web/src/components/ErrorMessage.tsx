interface ErrorMessageProps {
  message: string;
  statusCode?: number;
  code?: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, statusCode, code, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-card" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="error-content">
        <h3 className="error-title">Backend Connection Issue</h3>
        <p className="error-message">{message}</p>
        {(statusCode || code) && (
          <div className="error-details">
            {code && <span className="error-tag">Error Code: {code}</span>}
            {statusCode ? <span className="error-tag">HTTP Status: {statusCode}</span> : null}
          </div>
        )}
        <div className="error-advice">
          <small>
            Tip: Ensure your backend server is running (e.g. <code>cd backend &amp;&amp; npm run dev</code> on port 4000).
          </small>
        </div>
      </div>
      <button type="button" className="retry-btn" onClick={onRetry}>
        🔄 Retry Connection
      </button>
    </div>
  );
}
