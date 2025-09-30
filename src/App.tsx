import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const goToForm = () => {
    navigate('/form');
  };

  return (
    <>
      <div>
        <a  target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Consentimiento Impala Tattoo</h1>
      <div className="card">
        <button onClick={() => goToForm()}>
          Rellenar formulario
        </button>
      </div>
      <p className="read-the-docs">
        Todos los derechos reservados.
      </p>
    </>
  )
}