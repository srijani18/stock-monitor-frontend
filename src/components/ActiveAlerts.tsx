// src/components/ActiveAlerts.tsx
import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { Alert } from "../types/Alert";

interface Props {
  alerts: Alert[];
}

export const ActiveAlerts: React.FC<Props> = ({ alerts }) => {
  return (
    <div>
      
      <ListGroup>
        {alerts.map((alert) => (
          <ListGroup.Item key={alert.id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{alert.symbol}</strong> {alert.condition} ${alert.targetPrice}
              {alert.triggered && alert.triggeredAt && (
                <div className="text-muted small">Triggered at {new Date(alert.triggeredAt).toLocaleTimeString()}</div>
              )}
            </div>
            <Badge bg={alert.triggered ? "danger" : "warning"}>
              {alert.triggered ? "Triggered" : "Pending"}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};
