import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { PlanProvider } from "./components/ContextApi.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <PlanProvider>
    <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      
    </BrowserRouter>
    </PlanProvider>
  </StrictMode>
);
