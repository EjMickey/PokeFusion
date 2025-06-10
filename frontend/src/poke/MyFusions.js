import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import './Premium.css'

function MyFusions({ isPremium }) {
  const [myPokeFusions, setMyPokeFusions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyFusions() {
      if (isPremium) {
        try {
          setLoading(true);
          const res = await fetch('http://localhost:3001/my-fusions', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            setMyPokeFusions(data.fusions || []);
            setError(null);
          } else if (res.status === 404) {
            setError("Brak fuzji");
          } else {
            setError("Błąd podczas pobierania fuzji");
          }
        } catch (error) {
          setError("Błąd podczas pobierania fuzji: " + error.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchMyFusions();
  }, []);

  async function handleDeleteFusion(id) {
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć tę fuzję?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/my-fusions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setMyPokeFusions((prev) => prev.filter(fusion => fusion._id !== id));
      } else {
        alert("Nie udało się usunąć fuzji.");
      }
    } catch (err) {
      alert("Błąd podczas usuwania fuzji: " + err.message);
    } finally {

      if (loading) {
        return <div className="text-center mt-4"><Spinner animation="border" /></div>;
      }

      if (error) {
        return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
      }

      if (!myPokeFusions.length) {
        return <Alert variant="info" className="mt-4 text-center">Brak fuzji do wyświetlenia.</Alert>;
      }
    }
  }

  return (
    <div class="fuse-container">
    <Container className="mt-4">
      {isPremium ? (
        <Row>
          {myPokeFusions.map((entry) => (
            <Col key={entry._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="text-center"
                style={{ cursor: 'pointer', filter: 'drop-shadow(0px 0px 5px #000000)' }}
                onClick={() => handleDeleteFusion(entry._id)}
                title="Kliknij, aby usunąć fuzję"
              >
                <Card.Img
                  variant="top"
                  src={`https://images.alexonsager.net/pokemon/fused/${entry.pokemon1}/${entry.pokemon1}.${entry.pokemon2}.png`}
                  alt="Fuzja Pokémona"
                  style={{ filter: 'drop-shadow(2px 2px 2px #000000)' }}
                />
                <Card.Body>
                  <Card.Title>
                    #{entry.pokemon1} + #{entry.pokemon2}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>) : 
        (
          <>
        <h1>Funkcja premium!</h1><br></br>
        <h5>Chcesz zapisywać wyniki swoich fuzji? - Przejdź do zakładki Premium i dowiedz się więcej</h5></>
        )}
    </Container></div>
  );
}

export default MyFusions;
