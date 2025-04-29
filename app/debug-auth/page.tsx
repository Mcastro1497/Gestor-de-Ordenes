import { ManualLogin } from "@/components/auth/manual-login"
import { DebugUserRole } from "@/components/debug-user-role"

export default function DebugAuthPage() {
  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">Depuración de Autenticación</h1>
      <p className="text-muted-foreground">
        Esta página permite probar la autenticación y verificar el estado de la sesión.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Iniciar Sesión</h2>
          <ManualLogin />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Información de Usuario</h2>
          <DebugUserRole />
        </div>
      </div>
    </div>
  )
}
