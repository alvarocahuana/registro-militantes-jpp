
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
        <header className="header glass">
          <div className="container header-container">
            <Link to="/" className="brand">
              <span className="brand-icon" style={{ fontSize: '2rem' }}>JP</span>
              <div>
                <div style={{ lineHeight: 1 }}>Juntos por el Perú</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--jpp-green)', fontWeight: 600 }}>Registro de Militantes</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px', letterSpacing: '0.05em' }}>CÉSAR HUGO TITO ROJAS<br />CANDIDATO A DIPUTADO</div>
              </div>
            </Link>

            <Navigation />
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
