import { Route, Routes, } from "react-router-dom";
import { UserProvider } from "./components";
import { Home, Login, Game, GameHistory, GameHistoryDetails } from "./pages";

import "./App.css";

function App() {
  return (
    <>
    <UserProvider>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Login" element={<Login />} />
            <Route path="Game" element={<Game />} />
            <Route path="GameHistory" element={<GameHistory />} />
            <Route path="GameHistoryDetails" element={<GameHistoryDetails />} />
          </Routes>
        </main>
    </UserProvider>
    </>
  );
}

export default App;
