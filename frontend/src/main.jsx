import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContextProvider.jsx";
import CartContextProvider from "./context/CartContextProvider.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <UserContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </UserContextProvider>
    </ShopContextProvider>
  </BrowserRouter>
);
