import logo from './logo.svg';
import './App.css';
import Login from "./components/Login";

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            NDANNAMO APPLICATION
          </p>
          <p> Test login</p>
          <div>
            <Login></Login>
          </div>
        </header>
      </div>
  );
}

export default App;
