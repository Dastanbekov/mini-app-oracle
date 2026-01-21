import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Game from './pages/Game';
import Astrology from './pages/Astrology';
import Numerology from './pages/Numerology';
import HumanDesign from './pages/HumanDesign';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Game />} />
        <Route path="astrology" element={<Astrology />} />
        <Route path="numerology" element={<Numerology />} />
        <Route path="human-design" element={<HumanDesign />} />
      </Route>
    </Routes>
  );
}

export default App;
