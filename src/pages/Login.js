import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { Notyf } from 'notyf';

export default function Login() {
  const notyf = new Notyf();

  const { user, setUser } = useContext(UserContext);

  const [emailUser, setEmailUser] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (emailUser !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [emailUser, password]);

  function loginUser(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailUser: emailUser,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access !== undefined) {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);

          setEmailUser('');
          setPassword('');
          notyf.success('You are logged in');
        } else if (data.message === 'Incorrect email or password') {
          notyf.error(data.message);
        } else if (data.message === 'No email found') {
          notyf.error('Email does not exist');
        } else if (data.message === 'No username found') {
          notyf.error('Username does not exist');
        } else {
          notyf.error('Error logging in');
        }
      });
  }

  function retrieveUserDetails(token) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  }

  return user.id !== null ? (
    <Navigate to="/" />
  ) : (
    <div className="d-flex justify-content-center mt-5">
      <Card
        className="p-4 bg-dark text-dark-important"
        style={{ width: '400px' }}
      >
        <Card.Body>
          <Row className="justify-content-center">
            <Col md={12} className="text-center">
              <h1 className="mb-4">Login</h1>
            </Col>
          </Row>

          <Form onSubmit={(e) => loginUser(e)}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address or Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email or username"
                required
                value={emailUser}
                onChange={(e) => setEmailUser(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {isActive ? (
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            ) : (
              <Button variant="danger" type="submit" className="w-100" disabled>
                Login
              </Button>
            )}
          </Form>

          <h6 className="mt-3 text-center">
            Don't have an account yet? Click <Link to="/register">here</Link>
          </h6>
        </Card.Body>
      </Card>
    </div>
  );
}
