"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { ModalForm } from "@/components/ui/modal-form";
import { soilSamplesApi, farmsApi } from "@/services/api";

interface SoilSampleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SoilSampleForm({
  isOpen,
  onClose,
  onSuccess,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await soilSamplesApi.create({
        farm: formData.farmId,
        sample_date: formData.sampleDate,
        pH: formData.pH,
        moisture_pct: formData.moisturePct,
        nutrient_n: formData.nutrientN,
        nutrient_p: formData.nutrientP,
        nutrient_k: formData.nutrientK,
        notes: formData.notes,
      });
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError("Failed to save soil sample");
      setIsSubmitting(false);
    }
  };

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
          <Select
            value={formData.farmId}
            onValueChange={handleFarmChange}
            disabled={loadingFarms}
            required
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
          <Label htmlFor="sampleDate">Sample Date</Label>
          <Input
            id="sampleDate"
            name="sampleDate"
            type="date"
            value={formData.sampleDate}
            onChange={handleChange}
            required
          />
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

        {/* File upload and notes fields can be implemented as needed */}

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
              "Save Sample"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
