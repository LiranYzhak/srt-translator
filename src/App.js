import { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import Auth from './components/Auth';
import UserInfo from './components/UserInfo';
import ResetPassword from './components/ResetPassword';
import { supabase } from './config/supabase';
import { AppProvider } from './context/AppContext';
import logo from './images/SubliTranslate.png';

function App() {
  const [user, setUser] = useState(null);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    
    checkUser();

    // בדיקה האם אנחנו בדף איפוס סיסמה
    setIsResetPassword(window.location.pathname === '/reset-password');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AppProvider>
      <div dir="rtl">
        <h1 className="mainTitle">מתרגם הכתוביות - SubliTranslate</h1>
        {isResetPassword ? (
          <ResetPassword />
        ) : !user ? (
          <Auth onAuth={handleAuth} />
        ) : (
          <>
            <UserInfo user={user} onLogout={handleLogout} />
            <FileUploader />
          </>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
