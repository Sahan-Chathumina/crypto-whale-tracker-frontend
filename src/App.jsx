import { BrowserRouter, Routes, Route } from "react-router-dom";
import WhaleTrackerDemo from "./pages/WhaleTrackerDemo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WhaleTrackerDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
