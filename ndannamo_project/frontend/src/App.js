import './App.css';
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from './common/Navbar'
import FooterComponent from "./common/Footer";
import Home from "./pages/Home";
import Main from "./pages/Main";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <Navbar/>
                </header>
                <main className="App-main">
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/main" element={<Main/>} />
                    </Routes>
                </main>
                {/*<footer>
                    <FooterComponent/>
                </footer>*/}
            </div>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
