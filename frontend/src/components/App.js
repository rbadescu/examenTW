import SpacecraftList from "./spacecraftList";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AstronautList from "./astronautList";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<SpacecraftList />}
          />
          <Route
            path="/spacecrafts/:idSpacecraft/astronauts"
            element={<AstronautList />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;