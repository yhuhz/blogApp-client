import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Footer from './components/Footer';
import './App.css';
import Comments from './pages/Comments';

function App() {
  const [user, setUser] = useState({
    id: null,
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            id: data._id,
          });
        });
    } else {
      setUser({
        id: null,
      });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myPosts" element={<MyPosts />} />
            <Route path="/comments/:postId" element={<Comments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
