import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { APP_VERSION } from '../constants';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Lee la credencial desde el objeto window, con un valor de respaldo para desarrollo.
    // Esta configuración se define en un script en `index.html`.
    const validPassword = (window as any).CHURCH_PASSWORD || 'NIMT02';

    // Trim whitespace to be tolerant of mobile autocorrect errors
    if (password.trim() === validPassword) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciales incorrectas. Intente nuevamente.');
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card text-card-foreground rounded-2xl shadow-2xl border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Sistema de Finanzas</h1>
          <p className="text-muted-foreground">La Luz del Mundo</p>
        </div>
        
        {error && <div className="p-3 text-sm text-center text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="password-login" className="text-sm font-medium text-muted-foreground">Clave de Iglesia</label>
            <div className="relative mt-1">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </span>
              <input
                id="password-login"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full py-3 pl-10 pr-10 bg-input border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                aria-label={isPasswordVisible ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 font-semibold text-primary-foreground transition-colors rounded-lg bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Ingresar
        </button>

        <p className="pt-2 text-xs text-center text-muted-foreground">
          Versión {APP_VERSION}
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;