import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import styles from './Auth.module.css';
import { FiLock } from 'react-icons/fi';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }
    if (!hasUpperCase) {
      return 'הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית';
    }
    if (!hasLowerCase) {
      return 'הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית';
    }
    if (!hasNumber) {
      return 'הסיסמה חייבת להכיל לפחות ספרה אחת';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      await supabase.auth.signOut();
      
      setMessage('הסיסמה עודכנה בהצלחה! מיד תועבר למסך ההתחברות...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>איפוס סיסמה</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <FiLock className={styles.icon} />
            <input
              type="password"
              placeholder="סיסמה חדשה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className={styles.passwordRequirements}>
            <p>הסיסמה חייבת להכיל:</p>
            <ul>
              <li>לפחות 6 תווים</li>
              <li>לפחות אות גדולה אחת באנגלית</li>
              <li>לפחות אות קטנה אחת באנגלית</li>
              <li>לפחות ספרה אחת</li>
            </ul>
          </div>

          <div className={styles.inputGroup}>
            <FiLock className={styles.icon} />
            <input
              type="password"
              placeholder="אימות סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'מעבד...' : 'עדכן סיסמה'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword; 