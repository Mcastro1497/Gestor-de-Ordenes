import { CreateSupabaseAdmin } from "@/components/admin/create-supabase-admin"

export default function CreateSupabaseAdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Usuario Administrador en Supabase</h1>
      <CreateSupabaseAdmin />
    </div>
  )
}
