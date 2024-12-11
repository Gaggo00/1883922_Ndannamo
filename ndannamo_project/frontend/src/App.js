import './App.css';
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from './common/Navbar'
import FooterComponent from "./common/Footer";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Trips from "./pages/Trips";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";
import ProfilePage from "./userPages/ProfilePage";
import ChangePassword from "./userPages/ChangePassword";

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <div className="App">
                <Navbar/>
                <main className="App-main">
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/main" element={<Main/>} />
                        <Route path="/profile" element={<ProfilePage/>} />
                        <Route path="/trips" element={<Trips/>} />
                        <Route path="/change-password" element={<ChangePassword/>} />
                    </Routes>
                </main>
                <FooterComponent/>
            </div>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
