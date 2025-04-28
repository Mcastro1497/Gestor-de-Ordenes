"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Bandera para saber si estamos en el cliente
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key)
      // Analizar el elemento almacenado o devolver initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.error("Error al leer de localStorage:", error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Función para actualizar el valor en localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para seguir el mismo patrón que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Guardar estado
      setStoredValue(valueToStore)

      // Guardar en localStorage
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error al escribir en localStorage:", error)
    }
  }

  return [storedValue, setValue] as const
}
