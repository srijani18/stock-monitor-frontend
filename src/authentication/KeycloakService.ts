import Keycloak from "keycloak-js";


const keycloak = new Keycloak({
  url: "http://localhost:8081",
  realm: "stock-realm",
  clientId: "stock-frontend",
});

export default keycloak;
