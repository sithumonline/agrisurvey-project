"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ModalForm } from "@/components/ui/modal-form";
import { cropsApi } from "@/services/api";

interface CropFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  farmId: string;
  crop?: {
    id: string;
    crop_type: string;
    variety?: string;
    planting_date: string;
    expected_harvest?: string;
  };
}

export function CropForm({ isOpen, onClose, onSuccess, farmId, crop }: CropFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    crop_type: "",
    variety: "",
    planting_date: "",
    expected_harvest: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (crop) {
        // Edit mode - populate form with existing data
        setFormData({
          crop_type: crop.crop_type,
          variety: crop.variety || "",
          planting_date: crop.planting_date || "",
          expected_harvest: crop.expected_harvest || "",
        });
      } else {
        // Add mode - reset form
        setFormData({
          crop_type: "",
          variety: "",
          planting_date: "",
          expected_harvest: "",
        });
      }
      setValidationErrors({});
      setError(null);
    }
  }, [isOpen, crop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Clear harvest date error if planting date changes
    if (name === "planting_date" && validationErrors.expected_harvest) {
      setValidationErrors((prev) => ({ ...prev, expected_harvest: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.crop_type.trim()) {
      errors.crop_type = "Crop type is required";
    }
    
    if (!formData.planting_date) {
      errors.planting_date = "Planting date is required";
    }
    
    // Validate harvest date is after planting date
    if (formData.expected_harvest && formData.planting_date) {
      const plantingDate = new Date(formData.planting_date);
      const harvestDate = new Date(formData.expected_harvest);
      if (harvestDate <= plantingDate) {
        errors.expected_harvest = "Harvest date must be after planting date";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const submitData = {
        farm: farmId,
        crop_type: formData.crop_type.trim(),
        variety: formData.variety.trim() || null,
        planting_date: formData.planting_date,
        expected_harvest: formData.expected_harvest || null,
      };

      if (crop) {
        // Update existing crop
        await cropsApi.update(crop.id, submitData);
      } else {
        // Create new crop
        await cropsApi.create(submitData);
      }
      
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${crop ? "update" : "save"} crop`);
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      title={crop ? "Edit Crop" : "Add New Crop"}
      description={crop ? "Update crop information" : "Add a new crop to this farm"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="crop_type">
            Crop Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="crop_type"
            name="crop_type"
            placeholder="e.g., Maize, Wheat, Coffee"
            value={formData.crop_type}
            onChange={handleChange}
            className={validationErrors.crop_type ? "border-red-500" : ""}
          />
          {validationErrors.crop_type && (
            <p className="text-sm text-red-500">{validationErrors.crop_type}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="variety">Variety</Label>
          <Input
            id="variety"
            name="variety"
            placeholder="e.g., DH04, Arabica"
            value={formData.variety}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planting_date">
            Planting Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="planting_date"
            name="planting_date"
            type="date"
            value={formData.planting_date}
            onChange={handleChange}
            className={validationErrors.planting_date ? "border-red-500" : ""}
            required
          />
          {validationErrors.planting_date && (
            <p className="text-sm text-red-500">{validationErrors.planting_date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_harvest">Expected Harvest Date</Label>
          <Input
            id="expected_harvest"
            name="expected_harvest"
            type="date"
            value={formData.expected_harvest}
            onChange={handleChange}
            className={validationErrors.expected_harvest ? "border-red-500" : ""}
            min={formData.planting_date || undefined}
          />
          {validationErrors.expected_harvest && (
            <p className="text-sm text-red-500">{validationErrors.expected_harvest}</p>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {crop ? "Updating..." : "Saving..."}
              </>
            ) : (
              crop ? "Update Crop" : "Save Crop"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
} 