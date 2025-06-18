"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ModalForm } from "@/components/ui/modal-form";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { farmsApi } from "@/services/api";
import { offlineApi } from "@/services/offline-api";

interface SoilSampleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  farmId?: string; // Allow pre-selecting farm
  sample?: any; // For editing existing sample
}

export function SoilSampleForm({
  isOpen,
  onClose,
  onSuccess,
  farmId: defaultFarmId,
  sample,
}: SoilSampleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmId: "",
    sampleDate: "",
    pH: "",
    moisturePct: "",
    nutrientN: "",
    nutrientP: "",
    nutrientK: "",
    notes: "",
    photo: null as File | null,
  });
  const [farms, setFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setFormData({
        farmId: "",
        sampleDate: "",
        pH: "",
        moisturePct: "",
        nutrientN: "",
        nutrientP: "",
        nutrientK: "",
        notes: "",
        photo: null,
      });
      setValidationErrors({});
      setError(null);
    } else {
      // If editing, populate form with existing data
      if (sample) {
        setFormData({
          farmId: sample.farm || defaultFarmId || "",
          sampleDate: sample.sample_date || "",
          pH: sample.pH?.toString() || "",
          moisturePct: sample.moisture_pct?.toString() || "",
          nutrientN: sample.nutrient_n?.toString() || "",
          nutrientP: sample.nutrient_p?.toString() || "",
          nutrientK: sample.nutrient_k?.toString() || "",
          notes: sample.notes || "",
          photo: null, // Don't pre-populate file
        });
      } else if (defaultFarmId) {
        // Set default farm if provided
        setFormData(prev => ({ ...prev, farmId: defaultFarmId }));
      }
      
      // Load farms
      setLoadingFarms(true);
      farmsApi
        .getAll()
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.results;
          setFarms(data || []);
          setLoadingFarms(false);
        })
        .catch(() => {
          setError("Failed to load farms");
          setLoadingFarms(false);
        });
    }
  }, [isOpen, defaultFarmId, sample]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFarmChange = (value: string) => {
    setFormData((prev) => ({ ...prev, farmId: value }));
    if (validationErrors.farmId) {
      setValidationErrors((prev) => ({ ...prev, farmId: "" }));
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.farmId) {
      errors.farmId = "Farm is required";
    }

    if (!formData.sampleDate) {
      errors.sampleDate = "Sample date is required";
    }

    if (!formData.pH) {
      errors.pH = "pH level is required";
    } else {
      const pH = parseFloat(formData.pH);
      if (isNaN(pH) || pH < 0 || pH > 14) {
        errors.pH = "pH must be between 0 and 14";
      }
    }

    if (formData.moisturePct) {
      const moisture = parseFloat(formData.moisturePct);
      if (isNaN(moisture) || moisture < 0 || moisture > 100) {
        errors.moisturePct = "Moisture must be between 0 and 100%";
      }
    }

    // Validate NPK values
    if (formData.nutrientN) {
      const n = parseFloat(formData.nutrientN);
      if (isNaN(n) || n < 0 || n > 999) {
        errors.nutrientN = "Nitrogen must be between 0 and 999";
      }
    }

    if (formData.nutrientP) {
      const p = parseFloat(formData.nutrientP);
      if (isNaN(p) || p < 0 || p > 999) {
        errors.nutrientP = "Phosphorus must be between 0 and 999";
      }
    }

    if (formData.nutrientK) {
      const k = parseFloat(formData.nutrientK);
      if (isNaN(k) || k < 0 || k > 999) {
        errors.nutrientK = "Potassium must be between 0 and 999";
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
      const submitData = new FormData();
      submitData.append("farm", formData.farmId);
      submitData.append("sample_date", formData.sampleDate);
      submitData.append("pH", formData.pH);
      
      if (formData.moisturePct) {
        submitData.append("moisture_pct", formData.moisturePct);
      }
      if (formData.nutrientN) {
        submitData.append("nutrient_n", formData.nutrientN);
      }
      if (formData.nutrientP) {
        submitData.append("nutrient_p", formData.nutrientP);
      }
      if (formData.nutrientK) {
        submitData.append("nutrient_k", formData.nutrientK);
      }
      if (formData.notes) {
        submitData.append("notes", formData.notes);
      }
      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      if (sample) {
        // Update existing sample
        await offlineApi.soilSamples.update(sample.id, submitData);
      } else {
        // Create new sample
        await offlineApi.soilSamples.create(submitData);
      }
      
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save soil sample");
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      title={sample ? "Edit Soil Sample" : "Add New Soil Sample"}
      description="Record soil sample data from the field"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="farmId">
            Farm <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.farmId}
            onValueChange={handleFarmChange}
            disabled={loadingFarms}
          >
            <SelectTrigger 
              id="farmId"
              className={validationErrors.farmId ? "border-red-500" : ""}
            >
              <SelectValue
                placeholder={
                  loadingFarms ? "Loading farms..." : "Select a farm"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name} - {farm.owner_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.farmId && (
            <p className="text-sm text-red-500">{validationErrors.farmId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sampleDate">
            Sample Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sampleDate"
            name="sampleDate"
            type="date"
            value={formData.sampleDate}
            onChange={handleChange}
            className={validationErrors.sampleDate ? "border-red-500" : ""}
            max={new Date().toISOString().split('T')[0]} // Can't be in the future
          />
          {validationErrors.sampleDate && (
            <p className="text-sm text-red-500">{validationErrors.sampleDate}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pH">
              pH Level <span className="text-red-500">*</span>
            </Label>
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
              className={validationErrors.pH ? "border-red-500" : ""}
            />
            {validationErrors.pH && (
              <p className="text-sm text-red-500">{validationErrors.pH}</p>
            )}
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
              className={validationErrors.moisturePct ? "border-red-500" : ""}
            />
            {validationErrors.moisturePct && (
              <p className="text-sm text-red-500">{validationErrors.moisturePct}</p>
            )}
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
                step="0.1"
                min="0"
                max="999"
                placeholder="15"
                value={formData.nutrientN}
                onChange={handleChange}
                className={validationErrors.nutrientN ? "border-red-500" : ""}
              />
              {validationErrors.nutrientN && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.nutrientN}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nutrientP" className="text-xs">
                Phosphorus (P)
              </Label>
              <Input
                id="nutrientP"
                name="nutrientP"
                type="number"
                step="0.1"
                min="0"
                max="999"
                placeholder="8"
                value={formData.nutrientP}
                onChange={handleChange}
                className={validationErrors.nutrientP ? "border-red-500" : ""}
              />
              {validationErrors.nutrientP && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.nutrientP}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nutrientK" className="text-xs">
                Potassium (K)
              </Label>
              <Input
                id="nutrientK"
                name="nutrientK"
                type="number"
                step="0.1"
                min="0"
                max="999"
                placeholder="12"
                value={formData.nutrientK}
                onChange={handleChange}
                className={validationErrors.nutrientK ? "border-red-500" : ""}
              />
              {validationErrors.nutrientK && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.nutrientK}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sample Photo</Label>
          <PhotoUpload
            value={formData.photo}
            onPhotoChange={handlePhotoChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Additional observations about the soil sample"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
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
                {sample ? "Updating..." : "Saving..."}
              </>
            ) : (
              sample ? "Update Sample" : "Save Sample"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
