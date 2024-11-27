import './App.css';
import Login from "./components/Login";
import Navbar from './common/Navbar'
import FooterComponent from "./common/Footer";
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <div className="App">
                <header className="App-header">
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/login" element={<Login/>} />
                    </Routes>
                </header>
                  <FooterComponent/>
              </div>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
