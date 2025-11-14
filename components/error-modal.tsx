"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { XCircle } from "lucide-react"

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
}

export default function ErrorModal({ open, onOpenChange, title = "Ops!", message }: ErrorModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center space-y-4">
          <div className="rounded-full bg-red-50 p-3">
            <XCircle className="h-12 w-12 text-red-500" strokeWidth={2} />
          </div>
          <AlertDialogTitle className="text-2xl text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-foreground">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 px-8">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
