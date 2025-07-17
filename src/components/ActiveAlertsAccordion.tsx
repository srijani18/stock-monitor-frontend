import { Accordion, Badge } from "react-bootstrap";
import React from 'react';
import { Alert } from "../types/Alert"; 

interface Props {
  alerts: Alert[];
}

export const ActiveAlertsAccordion: React.FC<Props> = ({ alerts }) => (
  <Accordion defaultActiveKey="0">
    {alerts.map((alert, idx) => (
      <Accordion.Item eventKey={idx.toString()} key={alert.id}>
        <Accordion.Header>
          {alert.symbol} {alert.condition} ${alert.targetPrice} 
          <Badge bg={alert.triggered ? "danger" : "warning"} className="ms-2">
            {alert.triggered ? "Triggered" : "Pending"}
          </Badge>
        </Accordion.Header>
        <Accordion.Body>
          <p>Status: {alert.triggered ? "Triggered" : "Pending"}</p>
          {alert.triggeredAt && <p>Triggered At: {new Date(alert.triggeredAt).toLocaleString()}</p>}
        </Accordion.Body>
      </Accordion.Item>
    ))}
  </Accordion>
);
