import './App.css';
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from './common/Navbar'
import FooterComponent from "./common/Footer";
import Home from "./pages/Home";
import Main from "./pages/Main";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";
import ProfilePage from "./pages/UserPages/ProfilePage";
import ChangePassword from "./pages/UserPages/ChangePassword";
import TripSummary from "./pages/TripPages/Summary/TripSummary";
import TripChat from "./pages/TripPages/TripChat";
import TripSchedule from "./pages/TripPages/TripSchedule";
import TripExpenses from "./pages/TripPages/TripExpenses";
import TripPhotos from "./pages/TripPages/TripPhotos";
import { WebSocketProvider } from './utils/WebSocketProvider.js';

export default function App() {

    return (
        <AuthProvider>
            <WebSocketProvider>
                <BrowserRouter>
                    <div className="App">
                        <Navbar/>
                        <main className="App-main">
                            <Routes>
                                <Route path="/" element={<Home/>} />
                                <Route path="/login" element={<Login/>} />
                                <Route path="/register" element={<Register/>} />
                                <Route path="/trips" element={<Main/>} />
                                <Route path="/profile" element={<ProfilePage/>} />
                                <Route path="/trips/:id/summary" element={<TripSummary />} />
                                <Route path="/trips/:id/chat" element={<TripChat />} />
                                <Route path="/trips/:id/schedule" element={<TripSchedule />} />
                                <Route path="/trips/:id/expenses" element={<TripExpenses />} />
                                <Route path="/trips/:id/photos" element={<TripPhotos />} />
                                <Route path="/change-password" element={<ChangePassword/>} />
                                <Route path="/chat" element={<TripChat />} />
                            </Routes>
                        </main>
                        <FooterComponent/>
                    </div>
                </BrowserRouter>
            </WebSocketProvider>
        </AuthProvider>
    );
}