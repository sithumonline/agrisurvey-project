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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Upload } from "lucide-react";
import { ModalForm } from "@/components/ui/modal-form";
import { pestDiseaseApi, farmsApi } from "@/services/api";

interface PestReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PestReportForm({
  isOpen,
  onClose,
  onSuccess,
}: PestReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    farmId: "",
    category: "pest",
    name: "",
    severity: "medium",
    description: "",
    reportDate: "",
    // photo: null, // implement file upload if needed
  });
  const [farms, setFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await pestDiseaseApi.create({
        farm: formData.farmId,
        category: formData.category,
        name: formData.name,
        severity: formData.severity,
        description: formData.description,
        report_date: formData.reportDate,
        // photo: formData.photo, // implement file upload if needed
      });
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError("Failed to save report");
      setIsSubmitting(false);
    }
  };

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
                ? "Aphids, Armyworm, etc."
                : "Leaf Rust, Powdery Mildew, etc."
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
            placeholder="Describe the symptoms or infestation..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* File upload can be implemented here if needed */}

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
                Saving...
              </>
            ) : (
              "Save Report"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
