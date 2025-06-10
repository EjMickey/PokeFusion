import { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';

function Login({setActivePage}) {
  const [msg, setMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          localStorage.setItem('token', data.data);  // zapis tokena
          setMsg(data.message || 'Zalogowano pomyślnie!');
          window.location.reload();
        } else {
          setMsg(data.message || 'Niepoprawne dane logowania');
        }
      })
      .catch(() => setMsg('Błąd podczas logowania.'));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h3 className="mb-4 text-center">Logowanie</h3>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="example@email.com" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Hasło</Form.Label>
            <Form.Control type="password" name="password" required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-2">
            Zaloguj się
          </Button>
          <Button variant="secondary" type="button" className="w-100" onClick={() => setActivePage('register')}>
            Nie masz konta? Zarejestruj się!
          </Button>
        </Form>

        {msg && (
          <Alert variant="info" className="mt-3 text-center">
            {msg}
          </Alert>
        )}
      </Card>
    </Container>
  );
}

export default Login;
