import { useEffect, useState } from "react";
import './Fuse.css';
import './Premium.css';
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
function Premium({ token, isPremium }) {
    async function togglePremium() {
        let action = "";
        if(isPremium) action = "usunąć"
        else action = "aktywować"
        const confirmToggle = window.confirm("Czy na pewno chcesz "+action+" premium?");
        if(!confirmToggle) return;

        try {
            const res = await fetch('http://localhost:3001/premium', {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            window.location.reload()
        }
        catch(err){
            console.log(err)
        }
    }

    return (
        <div class="fuse-container">
            {isPremium ? (
                <>
                    <h1>Jesteś dumnym posiadaczem konta Premium!</h1>
                </>
            ) : (
                <>
                    <h1>Masz dość czekania 60 sekund na kolejną fuzję?</h1>
                    <p>Zostań trenerem Premium i fuzjuj ile dusza zapragnie – bez cooldownu, bez limitu!</p>
                </>
            )}
            <h3><br></br>Co zyskujesz z Premium:</h3>
            <br></br>
            <Container className="mt-3">
                <Row>
                    <Col xs={12} sm={6} lg={4} className="mb-3 premium-feature">
                        <h3>⚡<br></br>Nielimitowane fuzje</h3>
                    </Col>
                    <Col xs={12} sm={6} lg={4} className="mb-3 premium-feature">
                        <h3>📜<br></br>Dostęp do historii wszystkich twoich fuzji</h3>
                    </Col>
                    <Col xs={12} sm={6} lg={4} className="mb-3 premium-feature">
                        <h3>🏆<br></br>Specjalny znaczek Premium</h3>
                    </Col>
                </Row>
            </Container>
            {isPremium ?
                (<button onClick={togglePremium}>
                    Dezaktywuj Premium
                </button>) :
                (<button className="hue-button" onClick={togglePremium}>
                    Aktywuj teraz!
                </button>)
            }

        </div>
    )
}

export default Premium