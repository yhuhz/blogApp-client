import { Form, Button, Card } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';

export default function Register() {
  const notyf = new Notyf();

  const { user } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, confirmPassword]);

  function registerUser(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'User registered successfully') {
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          notyf.success('User registered successfully');
        } else if (
          data.message === 'Password must be atleast 8 characters long'
        ) {
          notyf.error('Password must be atleast 8 characters long');
        } else if (data.message === 'Email already in use') {
          notyf.error('Email already in use');
        } else if (data.message === 'Username already in use') {
          notyf.error('Username already in use');
        } else {
          notyf.error('Internal Server Error. Notify system admin.');
        }
      });
  }

  return user.id !== null ? (
    <Navigate to="/" />
  ) : (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card
        className="p-4 text-center bg-dark text-light"
        style={{ width: '400px' }}
      >
        <Card.Body>
          <h1 className="mb-4">Register</h1>
          <Form onSubmit={registerUser}>
            {[
              {
                type: 'email',
                placeholder: 'Email',
                state: email,
                setState: setEmail,
              },
              {
                type: 'username',
                placeholder: 'Username',
                state: username,
                setState: setUsername,
              },
              {
                type: 'password',
                placeholder: 'Password',
                state: password,
                setState: setPassword,
              },
              {
                type: 'password',
                placeholder: 'Confirm Password',
                state: confirmPassword,
                setState: setConfirmPassword,
              },
            ].map(({ type, placeholder, state, setState }, index) => (
              <Form.Group
                className="mb-3"
                controlId={`form${placeholder.replace(' ', '')}`}
                key={index}
              >
                <Form.Control
                  type={type}
                  placeholder={placeholder}
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Group>
            ))}

            <Button
              variant={isActive ? 'primary' : 'danger'}
              type="submit"
              disabled={!isActive}
              className="w-100"
            >
              Register
            </Button>
          </Form>
          <h6 className="mt-3 text-center">
            Already have an account? Click <Link to="/login">here</Link>
          </h6>
        </Card.Body>
      </Card>
    </div>
  );
}
