import { ToastContainer } from 'react-toastify';

export default function Home() {
  return (
    <div>
      <h1>Auth Demo (Vite + React)</h1>
      <p>Use Register → Login → Dashboard to test protected routes.</p>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
