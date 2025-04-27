import { createClient } from "@/lib/supabase/server"

// Datos del usuario administrador
const ADMIN_USER = {
  email: "admin@test.com",
  password: "Admin123!",
  name: "Administrador de Prueba",
  role: "admin",
}

export async function createAdminUser() {
  try {
    console.log("Iniciando creación de usuario administrador...")

    // Crear cliente de Supabase con permisos de servicio
    const supabase = createClient()

    // 1. Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(ADMIN_USER.email)

    if (checkError && checkError.message !== "User not found") {
      throw new Error(`Error al verificar usuario existente: ${checkError.message}`)
    }

    if (existingUser) {
      console.log("El usuario administrador ya existe:", existingUser.user.id)
      return {
        success: true,
        message: "El usuario administrador ya existe",
        userId: existingUser.user.id,
      }
    }

    // 2. Crear el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        name: ADMIN_USER.name,
        role: ADMIN_USER.role,
      },
    })

    if (authError) {
      throw new Error(`Error al crear usuario en Auth: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario en Auth")
    }

    console.log("Usuario creado en Auth:", authData.user.id)

    // 3. Verificar si existe una tabla de usuarios en Supabase
    const { data: tableInfo, error: tableError } = await supabase.from("users").select("*").limit(1).maybeSingle()

    // Si la tabla existe, insertamos el usuario
    if (!tableError) {
      console.log("Tabla 'users' encontrada, insertando usuario...")

      // 4. Insertar el usuario en la tabla users
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
        role: ADMIN_USER.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.warn("Error al insertar en tabla users:", insertError.message)
        // No fallamos aquí, ya que el usuario en Auth es lo más importante
      } else {
        console.log("Usuario insertado en tabla users")
      }
    } else {
      console.log("Tabla 'users' no encontrada o no accesible, continuando...")
    }

    return {
      success: true,
      message: "Usuario administrador creado con éxito",
      userId: authData.user.id,
    }
  } catch (error) {
    console.error("Error al crear usuario administrador:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      userId: null,
    }
  }
}
