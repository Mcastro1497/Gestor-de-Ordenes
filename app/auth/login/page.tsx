import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Gestor de Órdenes</h1>
          <p className="text-gray-600 mt-2">Sistema de gestión de órdenes y activos</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
