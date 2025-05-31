"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Plus,
  Search,
  ArrowRight,
  Wheat,
  Coffee,
  Apple,
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { FarmForm } from "@/components/forms/farm-form";
import { farmsApi } from "@/services/api"; // <-- import your API

const cropIconMap: Record<string, any> = {
  Maize: Wheat,
  Beans: Leaf,
  Wheat: Wheat,
  Coffee: Coffee,
  Apples: Apple,
  Pears: Apple,
  Grapes: Leaf,
  Tomatoes: Leaf,
  Peppers: Leaf,
  Onions: Leaf,
};

export default function FarmsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarms = () => {
    setLoading(true);
    farmsApi
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setFarms(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load farms");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchFarms();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Farms</h1>
            <p className="text-muted-foreground">
              View and manage surveyed farms
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Farm
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search farms..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading farms...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {farms.map((farm) => {
              // Pick a crop icon based on the first crop, fallback to Leaf
              const firstCrop = farm.crops?.[0]?.crop_type || "";
              const CropIcon = cropIconMap[firstCrop] || Leaf;
              return (
                <Card key={farm.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">
                      {farm.name}
                    </CardTitle>
                    <CropIcon className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Owner:
                        </span>
                        <span className="text-sm font-medium">
                          {farm.owner_name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Size:
                        </span>
                        <span className="text-sm font-medium">
                          {farm.size_ha} hectares
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Crops:
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {farm.crops?.map((crop: any) => (
                            <Badge
                              key={crop.id}
                              className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                              {crop.crop_type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Last visited:
                        </span>
                        <span className="text-sm font-medium">
                          {farm.updated_at
                            ? new Date(farm.updated_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      {/* <Link href={`/farms/${farm.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link> */}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <FarmForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
    </MainLayout>
  );
}
