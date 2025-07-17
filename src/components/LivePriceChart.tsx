import React, { useEffect, useState } from "react";
import keycloak from "../authentication/KeycloakService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface Stock {
  symbol: string;
  currentPrice: number;
  companyName?: string;
}

interface PricePoint {
  time: string;
  price: number;
}

interface Props {
  symbol: string;
}

export const LivePriceChart: React.FC<Props> = ({ symbol }) => {
  const [data, setData] = useState<PricePoint[]>([]);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [lineColor, setLineColor] = useState("#007bff");

  useEffect(() => {
    let client: Client;

    const connectWebSocket = async () => {
      try {
        // Ensure token is fresh
        await keycloak.updateToken(30);
        const token = keycloak.token;

        const socket = new SockJS(`http://localhost:8082/ws-stock?access_token=${token}`);

        
        
        client = new Client({
           webSocketFactory: () => socket as WebSocket,
         
         
          debug: (str) => console.log(str),
          onConnect: (frame) => {
             console.log('✅ Connected to WebSocket:', frame);
            client.subscribe("/topic/live-stocks", (message: IMessage) => {
              const stocks: Stock[] = JSON.parse(message.body);
              const stock = stocks.find((s) => s.symbol === symbol);
              console.log("Received message:", message.body);
              if (stock) {
                const now = new Date();
                const newPrice = stock.currentPrice;

                setData((prevData) => {
                  const updated = [
                    ...prevData,
                    { time: now.toLocaleTimeString(), price: newPrice },
                  ];
                  return updated.slice(-20); // keep last 20 points
                });

                if (prevPrice !== null) {
                  setLineColor(
                    newPrice > prevPrice
                      ? "green"
                      : newPrice < prevPrice
                      ? "red"
                      : "#007bff"
                  );
                }

                setPrevPrice(newPrice);
              }
            });
          },
          onStompError: (frame) => {
            console.error("STOMP error:", frame.headers["message"]);
            console.error("Details:", frame.body);
          },
        });

        client.activate();
      } catch (error) {
        console.error("WebSocket connection failed:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (client) client.deactivate();
    };
  }, [symbol]);

  return (
    <div className="mt-4">
      <h6>{symbol} Live Price</h6>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
