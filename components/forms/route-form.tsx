"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ModalForm } from "@/components/ui/modal-form"
import { routesApi } from "@/services/api" // Import the routes API

interface RouteFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void // Added success callback
}

export function RouteForm({ isOpen, onClose, onSuccess }: RouteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    status: "pending",
    assigned_to: "", // This should be the current user's ID or selected user
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, you would save the data to your backend here
      await routesApi.create(formData)
      setIsSubmitting(false)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        onClose() // Fallback to just closing the modal
      }
    } catch (err: any) {
      setIsSubmitting(false)
      setError(err.response?.data?.detail || "Failed to create route. Please try again.")
      console.error("Route creation error:", err)
    }
  }

  // Set assigned_to to current user ID from local storage when form opens
  useEffect(() => {
    if (isOpen) {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          setFormData(prev => ({
            ...prev,
            assigned_to: user.id
          }))
        }
      } catch (err) {
        console.error("Error setting user ID:", err)
      }
    }
  }, [isOpen])

  return (
      <ModalForm
          title="Add New Route"
          description="Create a new survey route for field assignments"
          isOpen={isOpen}
          onClose={onClose}
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Route Name</Label>
            <Input
                id="name"
                name="name"
                placeholder="Eastern District Route"
                value={formData.name}
                onChange={handleChange}
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
              ) : (
                  "Save Route"
              )}
            </Button>
          </div>
        </form>
      </ModalForm>
  )
}
