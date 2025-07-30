import { Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import { Alert } from "../types/Alert";

interface Props {
  alert: Alert;
  onClose: () => void;
}

export const TriggeredAlertToast: React.FC<Props> = ({ alert, onClose }) => {
  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast onClose={onClose} show={true} bg="danger" delay={8000} autohide>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">⚡ Alert Triggered!</strong>
        </Toast.Header>
        <Toast.Body>
          {alert.symbol} {alert.condition} {alert.targetPrice} triggered at{" "}
          {new Date(alert.triggeredAt!).toLocaleTimeString()}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
