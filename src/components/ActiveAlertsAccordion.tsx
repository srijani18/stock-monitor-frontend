import { Accordion, Badge, Button } from "react-bootstrap";
import React from 'react';
import { Alert } from "../types/Alert"; 

interface Props {
  alerts: Alert[],
   onDelete?: (id: number) => void;
  onReset?: (id: number) => void;
}

// export const ActiveAlertsAccordion: React.FC<Props> = ({ alerts, onDelete,onReset, }) => (
//   <Accordion defaultActiveKey="0">
//     {alerts.map((alert, idx) => (
//       <Accordion.Item eventKey={idx.toString()} key={alert.id}>
//         <Accordion.Header>
//           {alert.symbol} {alert.condition} ${alert.targetPrice} 
//           <Badge bg={alert.triggered ? "danger" : "warning"} className="ms-2">
//             {alert.triggered ? "Triggered" : "Pending"}
//           </Badge>
//         </Accordion.Header>
//         <Accordion.Body>
//           <p>Status: {alert.triggered ? "Triggered" : "Pending"}</p>
//           {alert.triggeredAt && <p>Triggered At: {new Date(alert.triggeredAt).toLocaleString()}</p>}
//         </Accordion.Body>
//       </Accordion.Item>
//     ))}
//   </Accordion>
// );


export const ActiveAlertsAccordion: React.FC<Props> = ({
  alerts,
  onDelete,
  onReset,
}) => {
  return (
    <Accordion defaultActiveKey="0">
      {alerts.map((alert, idx) => (
        <Accordion.Item eventKey={idx.toString()} key={alert.id}>
          <Accordion.Header>
            {alert.symbol} {alert.condition} {alert.targetPrice}
            {alert.triggered && <span className="ms-2 text-danger">🔥</span>}
          </Accordion.Header>
          <Accordion.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p><strong>Triggered:</strong> {alert.triggered ? "Yes" : "No"}</p>
                {alert.triggeredAt && (
                  <p><strong>Triggered At:</strong> {new Date(alert.triggeredAt).toLocaleString()}</p>
                )}
              </div>
              <div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => onDelete?.(alert.id)}
                >
                  Delete
                </Button>
                {alert.triggered && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onReset?.(alert.id)}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};