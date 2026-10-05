// src/App.jsx
import './App.css';
import AuthContextProvider from './providers/authContext.provider';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <AuthContextProvider>
        <AppRoutes />
    </AuthContextProvider>
  );
}

export default App;