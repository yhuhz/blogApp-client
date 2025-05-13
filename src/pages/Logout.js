import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
  // localStorage.clear();
  const { setUser, unsetUser } = useContext(UserContext);

  useEffect(() => {
    unsetUser();

    setUser({
      id: null,
      isAdmin: null,
    });
  }, []);

  return <Navigate to="/login" />;
}
