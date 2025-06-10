import { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';

function Register({setActivePage}) {
  const [msg, setMsg] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
        nick: e.target.nick.value
      })
    })
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('Błąd podczas rejestracji.'));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h3 className="mb-4 text-center">Rejestracja</h3>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formNick">
            <Form.Label>Nick</Form.Label>
            <Form.Control type="text" name="nick" placeholder="Twój nick" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="example@email.com" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Hasło</Form.Label>
            <Form.Control type="password" name="password" required />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mb-2">
            Zarejestruj
          </Button>
          <Button variant="secondary" type="button" className="w-100" onClick={() => setActivePage('login')}>
            Posiadasz już konto? Zarejestruj się!
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

export default Register;
