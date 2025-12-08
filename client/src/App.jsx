import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Secret from "./pages/Secret";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/secret/:id" element={<Secret />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;