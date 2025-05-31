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
import { farmsApi, routesApi } from "@/services/api"; // <-- import APIs

interface FarmFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FarmForm({ isOpen, onClose, onSuccess }: FarmFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    sizeHa: "",
    location: "",
    routeId: "",
  });
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, routeId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await farmsApi.create({
        name: formData.name,
        owner_name: formData.ownerName,
        size_ha: formData.sizeHa,
        location: formData.location,
        route: formData.routeId,
      });
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError("Failed to save farm");
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      title="Add New Farm"
      description="Register a new farm for surveying"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Farm Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Johnson's Maize Field"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            placeholder="Robert Johnson"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sizeHa">Size (hectares)</Label>
          <Input
            id="sizeHa"
            name="sizeHa"
            type="number"
            step="0.1"
            min="0"
            placeholder="5.2"
            value={formData.sizeHa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location Description</Label>
          <Textarea
            id="location"
            name="location"
            placeholder="Eastern District, Plot 12"
            value={formData.location}
            onChange={handleChange}
            rows={2}
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
                Saving...
              </>
            ) : (
              "Save Farm"
            )}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
