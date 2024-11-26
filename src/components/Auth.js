import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import styles from './Auth.module.css';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('נשלח קישור לאיפוס סיסמה לכתובת המייל שלך');
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });
        if (error) throw error;
        
        setMessage('ההרשמה בוצעה בהצלחה! אנא התחבר עם הפרטים שלך.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError(null);
    setMessage(null);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>
          {isForgotPassword 
            ? 'שחזור סיסמה'
            : (isLogin ? 'התחברות' : 'הרשמה')}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && !isForgotPassword && (
            <div className={styles.inputGroup}>
              <FiUser className={styles.icon} />
              <input
                type="text"
                placeholder="שם מלא"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <FiMail className={styles.icon} />
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isForgotPassword && (
            <div className={styles.inputGroup}>
              <FiLock className={styles.icon} />
              <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'מעבד...' : (
              isForgotPassword 
                ? 'שלח קישור לאיפוס סיסמה'
                : (isLogin ? 'התחבר' : 'הירשם')
            )}
          </button>
        </form>

        {isLogin && !isForgotPassword && (
          <button
            className={styles.forgotPasswordButton}
            onClick={toggleForgotPassword}
            type="button"
          >
            שכחת סיסמה?
          </button>
        )}

        {!isForgotPassword && (
          <button
            className={styles.toggleButton}
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? 'אין לך חשבון? הירשם' : 'יש לך חשבון? התחבר'}
          </button>
        )}

        {isForgotPassword && (
          <button
            className={styles.toggleButton}
            onClick={toggleForgotPassword}
            type="button"
          >
            חזור להתחברות
          </button>
        )}
      </div>
    </div>
  );
}

export default Auth; 