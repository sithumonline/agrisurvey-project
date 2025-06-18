"use client";

import type React from "react";
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
import { GPSLocation } from "@/components/ui/gps-location";
import { routesApi } from "@/services/api";
import { offlineApi } from "@/services/offline-api";

interface FarmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  farmData?: {
    id?: string;
    name: string;
    owner_name: string;
    size_ha: number | string;
    address?: string;
    location?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    photo?: string | null;
    route?: string;
  } | null;
}

export function FarmForm({ isOpen, onClose, onSuccess, farmData }: FarmFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    sizeHa: "",
    address: "",
    location: "",
    routeId: "",
    latitude: null as number | null,
    longitude: null as number | null,
    photo: null as File | null,
  });
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setFormData({
        name: "",
        ownerName: "",
        sizeHa: "",
        address: "",
        location: "",
        routeId: "",
        latitude: null,
        longitude: null,
        photo: null,
      });
      setValidationErrors({});
      setError(null);
    } else {
      // If editing, populate form with existing data
      if (farmData) {
        setFormData({
          name: farmData.name || "",
          ownerName: farmData.owner_name || "",
          sizeHa: farmData.size_ha?.toString() || "",
          address: farmData.address || "",
          location: farmData.location || "",
          routeId: farmData.route || "",
          latitude: typeof farmData.latitude === 'number' ? farmData.latitude : 
                   farmData.latitude ? parseFloat(farmData.latitude.toString()) : null,
          longitude: typeof farmData.longitude === 'number' ? farmData.longitude : 
                    farmData.longitude ? parseFloat(farmData.longitude.toString()) : null,
          photo: null, // Existing photo URL is handled separately
        });
      }
      
      // Load routes when opened
      setLoadingRoutes(true);
      routesApi
        .getAll()
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.results;
          setRoutes(data || []);
          setLoadingRoutes(false);
        })
        .catch(() => {
          setError("Failed to load routes");
          setLoadingRoutes(false);
        });
    }
  }, [isOpen, farmData]);

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

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, routeId: value }));
  };

  const handleLocationChange = (lat: number | null, lng: number | null) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handlePhotoChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Farm name is required";
    }
    if (!formData.ownerName.trim()) {
      errors.ownerName = "Owner name is required";
    }
    if (!formData.sizeHa) {
      errors.sizeHa = "Size is required";
    } else if (parseFloat(formData.sizeHa) <= 0) {
      errors.sizeHa = "Size must be greater than 0";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
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
      submitData.append("name", formData.name);
      submitData.append("owner_name", formData.ownerName);
      submitData.append("size_ha", formData.sizeHa);
      submitData.append("address", formData.address);
      submitData.append("location", formData.location);
      submitData.append("route", formData.routeId);
      
      if (formData.latitude !== null) {
        submitData.append("latitude", formData.latitude.toString());
      }
      if (formData.longitude !== null) {
        submitData.append("longitude", formData.longitude.toString());
      }
      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      if (farmData?.id) {
        // Update existing farm
        await offlineApi.farms.update(farmData.id, submitData);
      } else {
        // Create new farm
        await offlineApi.farms.create(submitData);
      }
      
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save farm");
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      title={farmData ? "Edit Farm" : "Add New Farm"}
      description={farmData ? "Update farm information" : "Register a new farm for surveying"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Farm Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Johnson's Maize Field"
            value={formData.name}
            onChange={handleChange}
            className={validationErrors.name ? "border-red-500" : ""}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">
            Owner Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ownerName"
            name="ownerName"
            placeholder="Robert Johnson"
            value={formData.ownerName}
            onChange={handleChange}
            className={validationErrors.ownerName ? "border-red-500" : ""}
          />
          {validationErrors.ownerName && (
            <p className="text-sm text-red-500">{validationErrors.ownerName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sizeHa">
            Size (hectares) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sizeHa"
            name="sizeHa"
            type="number"
            step="0.1"
            min="0"
            placeholder="5.2"
            value={formData.sizeHa}
            onChange={handleChange}
            className={validationErrors.sizeHa ? "border-red-500" : ""}
          />
          {validationErrors.sizeHa && (
            <p className="text-sm text-red-500">{validationErrors.sizeHa}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="123 Farm Road, Eastern District"
            value={formData.address}
            onChange={handleChange}
            className={validationErrors.address ? "border-red-500" : ""}
          />
          {validationErrors.address && (
            <p className="text-sm text-red-500">{validationErrors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Additional Location Details</Label>
          <Textarea
            id="location"
            name="location"
            placeholder="Near the main river, Plot 12"
            value={formData.location}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <GPSLocation
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={handleLocationChange}
        />

        <div className="space-y-2">
          <Label>Farm Photo</Label>
          <PhotoUpload
            value={formData.photo}
            onPhotoChange={handlePhotoChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routeId">Assigned Route</Label>
          <Select
            value={formData.routeId}
            onValueChange={handleRouteChange}
            disabled={loadingRoutes}
          >
            <SelectTrigger id="routeId">
              <SelectValue
                placeholder={
                  loadingRoutes ? "Loading routes..." : "Select a route"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                {farmData ? "Updating..." : "Saving..."}
              </>
            ) : (
              farmData ? "Update Farm" : "Save Farm"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
