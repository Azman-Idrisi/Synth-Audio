import { useState } from 'react';
import './index.css';
import HeroSection from './components/HeroSection';
import Loader from './components/Loader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Loader onComplete={() => setLoading(false)} />
      <HeroSection isLoading={loading} />
    </>
  );
}

export default App;
