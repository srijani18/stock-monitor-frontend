import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Alert } from "../types/Alert";
import { ActiveAlertsAccordion } from "../components/ActiveAlertsAccordion";

const sampleAlerts: Alert[] = [
  { id: 1, symbol: "AAPL", condition: ">", targetPrice: 200, triggered: false },
  { id: 2, symbol: "GOOGL", condition: "<", targetPrice: 130, triggered: true, triggeredAt: "2025-06-04T10:45:00Z" },
];

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
  const [search, setSearch] = useState("");

  const filteredAlerts = alerts.filter(alert =>
    alert.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <h2 className="mb-4 mt-3">🔔 Alerts</h2>

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
          <Button variant="success">+ Add Alert</Button> {/* You can add a modal later */}
        </Col>
      </Row>

      <ActiveAlertsAccordion alerts={filteredAlerts} />
    </Container>
  );
};

export default Alerts;
