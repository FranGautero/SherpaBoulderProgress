'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!name.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Check user count limit (200 users max)
      const { data: userCountData, error: countError } = await supabase
        .rpc('get_user_count');

      if (countError) {
        console.error('Error checking user count:', countError);
        throw new Error('Error verificando límite de usuarios');
      }

      if (userCountData >= 200) {
        throw new Error('Lo sentimos, hemos alcanzado el límite máximo de 200 usuarios registrados');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Wait a moment for the auth session to be fully established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create user profile with retry logic
        let retries = 3;
        let profileError = null;
        
        while (retries > 0) {
          const { error } = await supabase
            .from('profiles')
            .insert([{
              id: authData.user.id,
              email,
              name: name.trim(),
            }]);
          
          if (!error) {
            profileError = null;
            break;
          }
          
          profileError = error;
          retries--;
          
          if (retries > 0) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(`Error creating user profile: ${profileError.message}`);
        }

        // Show email confirmation message instead of auto-redirecting
        setUserEmail(email);
        setRegistrationSuccess(true);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // If registration was successful, show email confirmation message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-6">✉️</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Te hemos enviado un correo de confirmación a:
            </p>
            <p className="text-xl font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mb-6">
              {userEmail}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>Debes confirmar tu cuenta haciendo clic en el enlace del correo antes de poder iniciar sesión.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">Pasos siguientes:</p>
              <ol className="text-left space-y-1">
                <li>1. Revisa tu bandeja de entrada</li>
                <li>2. Busca el correo de Supabase Auth</li>
                <li>3. Haz clic en "Confirmar tu cuenta"</li>
                <li>4. Regresa aquí para iniciar sesión</li>
              </ol>
            </div>
            
            <a
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Ir a Iniciar Sesión
            </a>
            
            <a
              href="/"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              ← Volver al inicio
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              ¿No recibiste el correo? Revisa tu carpeta de spam o contacta al administrador del club.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center text-6xl mb-4">🧗‍♂️</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              inicia sesión si ya tienes cuenta
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ← Volver al inicio
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Este es un servicio gratuito para el club de escalada. 
              Tenemos un límite de 200 usuarios registrados.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
