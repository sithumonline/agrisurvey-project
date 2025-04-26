"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Upload } from "lucide-react"
import { ModalForm } from "@/components/ui/modal-form"

interface PestReportFormProps {
  isOpen: boolean
  onClose: () => void
}

export function PestReportForm({ isOpen, onClose }: PestReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    farmId: "",
    category: "pest",
    name: "",
    severity: "medium",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFarmChange = (value: string) => {
    setFormData((prev) => ({ ...prev, farmId: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSeverityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, severity: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      // In a real app, you would save the data to your backend here
      console.log("Pest/Disease report data submitted:", formData)
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
      title="Add New Pest/Disease Report"
      description="Record pest sightings or disease symptoms"
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

        <div className="space-y-2">
          <Label>Category</Label>
          <RadioGroup
            value={formData.category}
            onValueChange={handleCategoryChange}
            className="flex space-x-4"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pest" id="pest" />
              <Label htmlFor="pest" className="cursor-pointer">
                Pest
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disease" id="disease" />
              <Label htmlFor="disease" className="cursor-pointer">
                Disease
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder={formData.category === "pest" ? "Aphids, Armyworm, etc." : "Leaf Rust, Powdery Mildew, etc."}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Severity</Label>
          <RadioGroup
            value={formData.severity}
            onValueChange={handleSeverityChange}
            className="flex space-x-4"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="cursor-pointer">
                Low
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="cursor-pointer">
                High
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the symptoms or infestation..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Photo Evidence</Label>
          <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="h-6 w-6 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">JPG, PNG or HEIC up to 10MB</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Report"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  )
}
