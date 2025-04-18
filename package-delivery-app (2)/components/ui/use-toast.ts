"use client"

import React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type Toast = Omit<ToasterToast, "id">

function useToast() {
  const [, setToasts] = useState<ToasterToast[]>([])

  useEffect(() => {
    setToasts([...toasts])
  }, [])

  // Memoize the toast function to prevent it from being recreated on each render
  const toast = React.useCallback(({ ...props }: Toast) => {
    const id = genId()

    const newToast = {
      id,
      ...props,
    }

    toasts.push(newToast)
    setToasts([...toasts])

    setTimeout(() => {
      toasts.splice(
        toasts.findIndex((t) => t.id === id),
        1,
      )
      setToasts([...toasts])
    }, TOAST_REMOVE_DELAY)

    return {
      id,
      dismiss: () => {
        toasts.splice(
          toasts.findIndex((t) => t.id === id),
          1,
        )
        setToasts([...toasts])
      },
    }
  }, [])

  return { toast, toasts }
}

export { useToast, type ToasterToast }
