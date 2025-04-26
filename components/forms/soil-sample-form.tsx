"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { ModalForm } from "@/components/ui/modal-form"

interface SoilSampleFormProps {
  isOpen: boolean
  onClose: () => void
}

export function SoilSampleForm({ isOpen, onClose }: SoilSampleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    farmId: "",
    pH: "",
    moisturePct: "",
    nutrientN: "",
    nutrientP: "",
    nutrientK: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFarmChange = (value: string) => {
    setFormData((prev) => ({ ...prev, farmId: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      // In a real app, you would save the data to your backend here
      console.log("Soil sample data submitted:", formData)
    }, 1000)
  }

  // Mock farms for the select dropdown
  const farms = [
    { id: "1", name: "Johnson's Maize Field" },
    { id: "2", name: "Green Valley Coffee Plantation" },
    { id: "3", name: "Riverside Orchard" },
    { id: "4", name: "Eastern Wheat Fields" },
  ]

  return (
    <ModalForm
      title="Add New Soil Sample"
      description="Record soil sample data from the field"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="farmId">Farm</Label>
          <Select value={formData.farmId} onValueChange={handleFarmChange} required>
            <SelectTrigger id="farmId">
              <SelectValue placeholder="Select a farm" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pH">pH Level</Label>
            <Input
              id="pH"
              name="pH"
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="6.8"
              value={formData.pH}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moisturePct">Moisture (%)</Label>
            <Input
              id="moisturePct"
              name="moisturePct"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="42"
              value={formData.moisturePct}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nutrients (NPK)</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="nutrientN" className="text-xs">
                Nitrogen (N)
              </Label>
              <Input
                id="nutrientN"
                name="nutrientN"
                type="number"
                min="0"
                placeholder="15"
                value={formData.nutrientN}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nutrientP" className="text-xs">
                Phosphorus (P)
              </Label>
              <Input
                id="nutrientP"
                name="nutrientP"
                type="number"
                min="0"
                placeholder="8"
                value={formData.nutrientP}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nutrientK" className="text-xs">
                Potassium (K)
              </Label>
              <Input
                id="nutrientK"
                name="nutrientK"
                type="number"
                min="0"
                placeholder="12"
                value={formData.nutrientK}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Sample Photo</Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="h-6 w-6 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">JPG, PNG or HEIC up to 10MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            placeholder="Additional observations"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Sample"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  )
}
