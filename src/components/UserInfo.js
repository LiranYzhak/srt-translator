import React from 'react';
import { supabase } from '../config/supabase';
import { FiLogOut, FiUser } from 'react-icons/fi';
import styles from './UserInfo.module.css';

function UserInfo({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className={styles.userInfo}>
      <div className={styles.userDetails}>
        <FiUser className={styles.icon} />
        <span className={styles.email}>{user.email}</span>
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut className={styles.icon} />
        התנתק
      </button>
    </div>
  );
}

export default UserInfo; 