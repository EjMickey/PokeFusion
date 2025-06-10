import { useState, useEffect } from 'react';
import './App.css';
import Login from './auth/Login';
import Register from './auth/Register';
import Fuse from './poke/Fuse';
import Logout from './auth/Logout';
import MyFusions from './poke/MyFusions';
import TopNavBar from './nav/TopNavBar';
import Premium from './poke/Premium'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('fuse');
  const [isPremium, setIsPremium] = useState(false);
  const token = localStorage.getItem('token');
  const rand = Math.ceil(Math.random() * 1025);

  useEffect(() => {
      async function fetchPremium() {
          if (!token) return;

          try {
              const res = await fetch('http://localhost:3001/premium', {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              if (!res.ok) {
                  setIsPremium(false);
                  return;
              }

              const data = await res.json();

              if (data.message === 'premium') {
                  setIsPremium(true);
              } else {
                  setIsPremium(false);
              }
          } catch (error) {
              console.error(error);
              setIsPremium(false);
          }
      }

      fetchPremium();
  }, [token]);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const renderContent = () => {
    if (!isLoggedIn) {
      return activePage === 'register' ? (
        <>
          <Register setActivePage={setActivePage}/>
        </>
      ) : (
        <>
          <Login setActivePage={setActivePage}/>
        </>
      );
    }

    switch (activePage) {
      case 'fuse':
        return <Fuse />;
      case 'myfusions':
        return <MyFusions isPremium={isPremium}/>;
      case 'logout':
        localStorage.removeItem("token")
        window.location.reload()
      case 'premium':
        return <Premium token={token} isPremium={isPremium}/>;
      default:
        return <Fuse />;
    }
  };

  return (
    <div className="App" style={{backgroundImage: 'url(/img/background_3.jpg)',
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    minHeight: '100vh'}}>
      <TopNavBar setActivePage={setActivePage} token={token} isPremium={isPremium}/>
      {renderContent()}
    </div>
  );
}

export default App;
