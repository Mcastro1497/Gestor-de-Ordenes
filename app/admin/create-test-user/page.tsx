import { CreateTestAdmin } from "@/components/admin/create-test-admin"

export default function CreateTestUserPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Usuario de Prueba</h1>
      <CreateTestAdmin />
    </div>
  )
}
