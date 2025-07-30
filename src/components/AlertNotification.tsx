// import React, { useEffect, useState } from "react";
// import SockJS from "sockjs-client";
// import { Client, IMessage } from "@stomp/stompjs";
// import keycloak from "../authentication/KeycloakService";
// import { Toast, ToastContainer } from "react-bootstrap";
// import { Alert } from "../types/Alert";

// interface TriggeredAlert {
//   symbol: string;
//   condition: string;
//   targetPrice: number;
//   triggeredAt: string;
// }

// export const AlertNotification: React.FC = () => {
//   const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
//   const [showToast, setShowToast] = useState(false);
//   const [latestAlert, setLatestAlert] = useState<Alert | null>(null);

//   useEffect(() => {
//     let client: Client;

//     const connectWebSocket = async () => {
//       await keycloak.updateToken(30);
//       const token = keycloak.token;

//       const socket = new SockJS(`http://localhost:8082/ws-stock?access_token=${token}`);

//       client = new Client({
//         webSocketFactory: () => socket as WebSocket,
//         debug: (str) => console.log("[Alert WS]:", str),

//         onConnect: () => {
//           console.log("✅ Subscribed to /topic/alerts-triggered");

//           client.subscribe("/topic/alerts-triggered", (message: IMessage) => {
//             const alert: TriggeredAlert = JSON.parse(message.body);
//             console.log("🔔 Triggered alert received:", alert);
//             setAlerts((prev) => [...prev, alert]);
//             setShowToast(true);
//           });
//         },

//         onStompError: (frame) => {
//           console.error("STOMP error:", frame.headers["message"]);
//           console.error("Details:", frame.body);
//         },
//       });

//       client.activate();
//     };

//     connectWebSocket();

//     return () => {
//       if (client) client.deactivate();
//     };
//   }, []);

//   return (
//     <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
//       {alerts.map((alert, index) => (
//         <Toast
//           key={index}
//           bg="warning"
//           onClose={() => {
//             setAlerts((prev) => prev.filter((_, i) => i !== index));
//             if (alerts.length <= 1) setShowToast(false);
//           }}
//           show={showToast}
//           delay={5000}
//           autohide
//         >
//           <Toast.Header>
//             <strong className="me-auto">🚨 Alert Triggered</strong>
//             <small>{new Date(alert.triggeredAt).toLocaleTimeString()}</small>
//           </Toast.Header>
//           <Toast.Body>
//             {alert.symbol} {alert.condition} {alert.targetPrice}
//           </Toast.Body>
//         </Toast>
//       ))}
//     </ToastContainer>
//   );
// };


import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import keycloak from "../authentication/KeycloakService";
import { Toast, ToastContainer } from "react-bootstrap";
import { Alert } from "../types/Alert";

interface TriggeredAlert {
  symbol: string;
  condition: string;
  targetPrice: number;
  triggeredAt?: string;
}

export const AlertNotification: React.FC = () => {
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);

  useEffect(() => {
    let client: Client;

    const connectWebSocket = async () => {
      await keycloak.updateToken(30);
      const token = keycloak.token;

      const socket = new SockJS(`http://localhost:8082/ws-stock?access_token=${token}`);

      client = new Client({
        webSocketFactory: () => socket as WebSocket,
        debug: (str) => console.log("[Alert WS]:", str),

        onConnect: () => {
          console.log("✅ Connected and subscribing to /topic/alerts-triggered");

          client.subscribe("/topic/alerts-triggered", (message: IMessage) => {
            try {
              const alert: TriggeredAlert = JSON.parse(message.body);
              console.log("🔔 Triggered alert received:", alert);

              setAlerts((prev) => [...prev, alert]);
            } catch (err) {
              console.error("Failed to parse alert message:", err);
            }
          });
        },

        onStompError: (frame) => {
          console.error("STOMP error:", frame.headers["message"]);
          console.error("Details:", frame.body);
        },
      });

      client.activate();
    };

    connectWebSocket();

    return () => {
      if (client) client.deactivate();
    };
  }, []);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {alerts.map((alert, index) => (
        <Toast
          key={index}
          bg="warning"
          onClose={() => setAlerts((prev) => prev.filter((_, i) => i !== index))}
          show={true}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">🚨 Alert Triggered</strong>
            <small>{alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleTimeString() : "Now"}</small>
          </Toast.Header>
          <Toast.Body>
            {alert.symbol} {alert.condition} {alert.targetPrice}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};
