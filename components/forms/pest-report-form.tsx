"use client";

import { useState, useEffect, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Upload, X, Camera } from "lucide-react";
import { ModalForm } from "@/components/ui/modal-form";
import { pestDiseaseApi, farmsApi } from "@/services/api";
import { getMediaUrl } from "@/lib/api-utils";

interface PestReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  farmId?: string;
  report?: any; // For editing existing report
}

export function PestReportForm({
  isOpen,
  onClose,
  onSuccess,
  farmId,
  report,
}: PestReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmId: farmId || "",
    category: "pest",
    name: "",
    severity: "medium",
    description: "",
    reportDate: new Date().toISOString().split('T')[0],
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset form when opened
    if (report) {
      // Edit mode - populate with existing data
      setFormData({
        farmId: report.farm || farmId || "",
        category: report.category || "pest",
        name: report.name || "",
        severity: report.severity || "medium",
        description: report.description || "",
        reportDate: report.report_date || new Date().toISOString().split('T')[0],
      });
      // If report has a photo, show it as preview
      if (report.photo) {
        setPhotoPreview(getMediaUrl(report.photo));
      }
    } else {
      // Create mode - reset to defaults
      setFormData(prev => ({
        ...prev,
        farmId: farmId || "",
        category: "pest",
        name: "",
        severity: "medium",
        description: "",
        reportDate: new Date().toISOString().split('T')[0],
      }));
      setPhoto(null);
      setPhotoPreview(null);
    }
    setError(null);
    
    // Only load farms if not provided
    if (!farmId && !report?.farm) {
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
    } else {
      setLoadingFarms(false);
    }
  }, [isOpen, farmId, report]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFarmChange = (value: string) => {
    setFormData((prev) => ({ ...prev, farmId: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSeverityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, severity: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, reportDate: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Photo size must be less than 10MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const submitData = new FormData();
      submitData.append('farm', formData.farmId);
      submitData.append('category', formData.category);
      submitData.append('name', formData.name);
      submitData.append('severity', formData.severity);
      submitData.append('description', formData.description);
      submitData.append('report_date', formData.reportDate);
      
      if (photo) {
        submitData.append('photo', photo);
      }

      if (report) {
        // Update existing report
        await pestDiseaseApi.update(report.id, submitData);
      } else {
        // Create new report
        await pestDiseaseApi.create(submitData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving report:', err);
      if (err.response?.data) {
        const errorMessages = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        setError(errorMessages);
      } else {
        setError("Failed to save report");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      title={report ? "Edit Pest/Disease Report" : "Add Pest/Disease Report"}
      description="Record pest sightings or disease symptoms on the farm"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {!farmId && !report?.farm && (
          <div className="space-y-2">
            <Label htmlFor="farmId">Farm</Label>
            <Select
              value={formData.farmId}
              onValueChange={handleFarmChange}
              required
              disabled={loadingFarms}
            >
              <SelectTrigger id="farmId">
                <SelectValue
                  placeholder={
                    loadingFarms ? "Loading farms..." : "Select a farm"
                  }
                />
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
        )}

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
            placeholder={
              formData.category === "pest"
                ? "e.g. Aphids, Armyworm, Locust"
                : "e.g. Leaf Rust, Powdery Mildew, Blight"
            }
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
          <Label htmlFor="reportDate">Report Date</Label>
          <Input
            id="reportDate"
            name="reportDate"
            type="date"
            value={formData.reportDate}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the symptoms, affected areas, or other observations..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Photo (optional)</Label>
          {!photoPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload a photo
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Maximum size: 10MB
                </span>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemovePhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                {report ? "Updating..." : "Saving..."}
              </>
            ) : (
              report ? "Update Report" : "Save Report"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
