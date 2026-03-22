import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
        }}
      />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;