import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Gestor de Órdenes</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Restablecer contraseña</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
