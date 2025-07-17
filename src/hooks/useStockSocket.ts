// src/hooks/useStockSocket.ts
import { useEffect, useState } from "react";
import { Stock } from "../types/Stock";

export function useStockSocket(): Stock[] {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/stocks");

    socket.onmessage = (event: MessageEvent) => {
      const stock: Stock = JSON.parse(event.data);
      setStocks((prev) => [...prev.slice(-50), stock]);
    };

    return () => socket.close();
  }, []);

  return stocks;
}
