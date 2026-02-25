
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

import RegistrationForm from './components/RegistrationForm';
import MilitantsList from './components/MilitantsList';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="nav-links">
      <Link
        to="/"
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        <UserPlus size={18} />
        <span>Registrar</span>
      </Link>
      <Link
        to="/list"
        className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`}
      >
        <Users size={18} />
        <span>Militantes</span>
      </Link>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <header style={{
          position: 'relative',
          background: 'linear-gradient(105deg, var(--jpp-green) 0%, var(--jpp-green) 22%, #ffffff 22%, #ffffff 78%, var(--jpp-red) 78%, var(--jpp-red) 100%)',
          padding: '1.5rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              padding: '1rem 2rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255,255,255,0.8)'
            }}>
              <Link to="/" className="brand" style={{ gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '-10px' }}>
                  <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    border: '4px solid var(--jpp-green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--jpp-red)', fontSize: '2.2rem', fontWeight: 900,
                    lineHeight: 1, paddingTop: '2px', backgroundColor: 'white',
                    position: 'relative', zIndex: 2
                  }}>
                    JP
                  </div>
                  <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    border: '4px solid white',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    marginLeft: '-15px',
                    position: 'relative', zIndex: 1,
                    boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
                  }}>
                    <img src="/candidato.jpg" alt="César Hugo Tito Rojas" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ lineHeight: 1, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.8rem', color: 'var(--jpp-green)', fontWeight: 900, letterSpacing: '-0.5px' }}>JUNTOS</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--jpp-green)', fontWeight: 800, lineHeight: 1.1, textAlign: 'center' }}>POR<br />EL</span>
                    <span style={{ fontSize: '1.8rem', color: 'var(--jpp-red)', fontWeight: 900, letterSpacing: '-0.5px' }}>PERÚ</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px', letterSpacing: '0.05em', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', width: 'fit-content', border: '1px solid #e2e8f0' }}>
                    CÉSAR HUGO TITO ROJAS <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>•</span> CANDIDATO A DIPUTADO
                  </div>
                </div>
              </Link>

              <Navigation />
            </div>
          </div>
        </header>

        <main className="main-content container animate-fade-in">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/list" element={<MilitantsList />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Juntos por el Perú - Base Regional. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
