import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Auth } from "./pages/Auth";
import Editor from "./pages/Editor";
import Home from "./pages/home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/auth" element={<Auth/>}></Route>
          <Route path="/editor/" element={<Editor/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
