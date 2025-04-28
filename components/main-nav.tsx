"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { TrendingUp, Plus, BellOff, Bell, LayoutDashboard, Settings, Users, LineChart } from "lucide-react"
import { useState, useEffect } from "react"
import { NotificationBadge } from "./notification-badge"
import { markNotificationsAsRead } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { NotificationCenter } from "./notification-center"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { useSupabase } from "@/hooks/use-supabase"

interface MainNavProps {
  orders?: Order[] // Ahora las órdenes se pasan como prop
  onRefreshOrders?: () => void // Callback para refrescar las órdenes
}

export function MainNav({ orders = [], onRefreshOrders }: MainNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { supabase } = useSupabase()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Obtener el rol del usuario actual
    const fetchUserRole = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user?.email) {
          const { data: userData, error } = await supabase
            .from("usuarios")
            .select("rol")
            .eq("email", session.user.email)
            .single()

          if (error) {
            console.error("Error al obtener rol del usuario:", error)
          } else if (userData) {
            setUserRole(userData.rol)
            console.log("Rol del usuario:", userData.rol)
          }
        }
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error)
      }
    }

    fetchUserRole()
  }, [supabase])

  // Calcular el total de notificaciones a partir de las órdenes proporcionadas
  const totalNotifications = orders.reduce((sum, order) => sum + (order.unreadUpdates || 0), 0)

  // Función para marcar todas las notificaciones como leídas
  const markAllNotificationsAsRead = async () => {
    try {
      const ordersWithNotifications = orders
        .filter((order) => order.unreadUpdates && order.unreadUpdates > 0)
        .map((order) => order.id)

      if (ordersWithNotifications.length > 0) {
        await markNotificationsAsRead(ordersWithNotifications)
        toast({
          title: "Notificaciones",
          description: "Todas las notificaciones han sido marcadas como leídas",
        })

        // Llamar al callback de actualización si existe
        if (onRefreshOrders) {
          onRefreshOrders()
        }
      }
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
    }
  }

  // Función para crear una nueva orden
  const handleCreateOrder = () => {
    router.push("/orders/create")
  }

  // Función para abrir el centro de notificaciones
  const openNotificationCenter = () => {
    setNotificationCenterOpen(true)
  }

  if (!isClient) {
    return null // No renderizar nada en el servidor para evitar errores de hidratación
  }

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <TrendingUp className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Gestor de Órdenes</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Link>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2 relative">
                Acciones
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1">
                    <NotificationBadge count={totalNotifications} onClick={(e) => e.stopPropagation()} />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateOrder}>
                <Plus className="mr-2 h-4 w-4" />
                Crear nueva orden
              </DropdownMenuItem>

              <DropdownMenuItem onClick={openNotificationCenter}>
                <Bell className="mr-2 h-4 w-4" />
                Centro de notificaciones
                {totalNotifications > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">{totalNotifications}</Badge>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              {totalNotifications > 0 && (
                <DropdownMenuItem onClick={markAllNotificationsAsRead}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Marcar todas como leídas
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          href="/trading"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center",
            pathname?.startsWith("/trading") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Mesa de Trading
        </Link>

        <Link
          href="/config"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center",
            pathname?.startsWith("/config") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Link>

        {userRole === "admin" && (
          <Link
            href="/admin"
            className={cn(
              "transition-colors hover:text-foreground/80 flex items-center",
              pathname?.startsWith("/admin") ? "text-foreground" : "text-foreground/60",
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            Administración
          </Link>
        )}
      </nav>

      {/* Centro de notificaciones */}
      <NotificationCenter
        open={notificationCenterOpen}
        onOpenChange={setNotificationCenterOpen}
        orders={orders}
        onRefresh={onRefreshOrders}
      />
    </div>
  )
}
