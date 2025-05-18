import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResolveAlertForm.module.css';

function ResolveAlertForm({ alertId, darkMode }) {
  const [resolvedBy, setResolvedBy] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/diagnostics/${alertId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolvedBy, resolutionNote }),
      });

      if (res.ok) {
        navigate('/alerts/history');
      } else {
        console.error('Failed to resolve alert');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.inputGroup}>
        <label>Resolved By</label>
        <input
          type="text"
          value={resolvedBy}
          onChange={(e) => setResolvedBy(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Resolution Note</label>
        <textarea
          rows="4"
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.button} disabled={submitting}>
        {submitting ? 'Resolving...' : 'Resolve Alert'}
      </button>
    </form>
  );
}

export default ResolveAlertForm;
