"use client"

import { CreateAuthUser } from "@/components/admin/create-auth-user"

export default function CreateAuthUserPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Crear Usuario de Autenticación</h1>
      <CreateAuthUser />
    </div>
  )
}
