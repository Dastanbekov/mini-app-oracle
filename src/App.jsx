import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Rituals from './pages/Rituals';
import Collection from './pages/Collection';
import KnowledgeBase from './pages/KnowledgeBase';
import Astrology from './pages/Astrology';
import Numerology from './pages/Numerology';
import HumanDesign from './pages/HumanDesign';
import Achievements from './pages/Achievements';
import Shop from './pages/Shop';
import TaroCoin from './pages/TaroCoin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Rituals />} />
        <Route path="collection" element={<Collection />} />
        <Route path="shop" element={<Shop />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="astrology" element={<Astrology />} />
        <Route path="numerology" element={<Numerology />} />
        <Route path="human-design" element={<HumanDesign />} />
        <Route path="taro-coin" element={<TaroCoin />} />
      </Route>
    </Routes>
  );
}

export default App;
