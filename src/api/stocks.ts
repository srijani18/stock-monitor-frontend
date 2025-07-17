// src/api/stocks.ts
import axios from "axios";
import { Stock} from "../types/Stock";
import keycloak from "../authentication/KeycloakService";


const API_URL = "http://localhost:8082/api/stocks"; // your Spring Boot base URL

export const fetchStockSummary = async (symbols: string[]): Promise<Stock[]> => {
  const token = keycloak.token;

  const params = symbols.length > 0 ? { symbols: symbols.join(",") } : {};

  const response = await axios.get<Stock[]>(`${API_URL}/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
    params,
  });

  return response.data;
};
