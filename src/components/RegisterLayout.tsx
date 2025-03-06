
import { RegisterForm } from "./RegisterForm";

export function RegisterLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-950 dark:to-blue-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Crea una cuenta para comenzar
          </p>
        </div>
        
        <RegisterForm />
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          ¿Ya tienes una cuenta? <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
