import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Auth } from "./pages/Auth";
import Editor from "./pages/Editor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth/>}></Route>
          <Route path="/editor/" element={<Editor/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
