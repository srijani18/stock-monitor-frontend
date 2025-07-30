import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Alert } from "../types/Alert";
import { ActiveAlertsAccordion } from "../components/ActiveAlertsAccordion";
import Modal from "react-bootstrap/Modal";
import { AlertForm } from "../components/AlertForm";
import { AlertNotification } from "../components/AlertNotification";
import keycloak from "../authentication/KeycloakService";

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);


  // ✅ Fetch alerts from DB on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        await keycloak.updateToken(30);
        const token = keycloak.token;

        const response = await fetch("http://localhost:8082/api/alerts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
          console.log("✅ Loaded alerts from DB:", data);
        } else {
          console.error("❌ Failed to fetch alerts:", response.status);
        }
      } catch (err) {
        console.error("❌ Error fetching alerts:", err);
      }
    };

    fetchAlerts();
  }, []);

  const handleDeleteAlert = async (id: number) => {
  try {
    await keycloak.updateToken(30);
    const token = keycloak.token;

    const res = await fetch(`http://localhost:8082/api/alerts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      console.log(`🗑️ Alert ${id} deleted`);
    } else {
      console.error(`❌ Failed to delete alert ${id}`);
    }
  } catch (err) {
    console.error(`❌ Error deleting alert ${id}:`, err);
  }
};

const handleResetAlert = async (id: number) => {
  try {
    await keycloak.updateToken(30);
    const token = keycloak.token;

    const res = await fetch(`http://localhost:8082/api/alerts/reset/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updated = await res.json();
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
      console.log(`🔄 Alert ${id} reset`);
    } else {
      console.error(`❌ Failed to reset alert ${id}`);
    }
  } catch (err) {
    console.error(`❌ Error resetting alert ${id}:`, err);
  }
};


  const filteredAlerts = alerts.filter((alert) =>
    alert.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAlert = async (newAlert: Omit<Alert, "id" | "triggered" | "triggeredAt">) => {
    try {
      await keycloak.updateToken(30);
      const token = keycloak.token;

      const response = await fetch("http://localhost:8082/api/alerts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlert),
      });

      if (response.ok) {
        const savedAlert = await response.json();
        setAlerts((prev) => [...prev, savedAlert]);
        setShowModal(false);
        console.log("✅ Alert saved:", savedAlert);
      } else {
        console.error("❌ Failed to save alert:", response.status);
      }
    } catch (err) {
      console.error("❌ Error sending alert:", err);
    }
  };

  return (
    <Container>
      <h2 className="mb-4 mt-3">🔔 Alerts</h2>
      <AlertNotification />

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            + Add Alert
          </Button>
        </Col>
      </Row>

      <ActiveAlertsAccordion alerts={filteredAlerts} onDelete={handleDeleteAlert}
  onReset={handleResetAlert} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set New Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AlertForm sendAlert={handleAddAlert} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Alerts;
