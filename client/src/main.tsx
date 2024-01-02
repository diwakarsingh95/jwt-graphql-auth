import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BACKEND_URL } from "./utils/constants";
import AuthContextProvider from "./context/AuthContext";

const apolloClient = new ApolloClient({
  uri: `${BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
