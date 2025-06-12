"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Plus,
  ArrowRight,
  FlaskRoundIcon as Flask,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { SoilSampleForm } from "@/components/forms/soil-sample-form";
import { WaterSampleForm } from "@/components/forms/water-sample-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { soilSamplesApi, waterSamplesApi } from "@/services/api";
import { getMediaUrl } from "@/lib/api-utils";

export default function SamplingPage() {
  const [isSoilFormOpen, setIsSoilFormOpen] = useState(false);
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [soilSamples, setSoilSamples] = useState<any[]>([]);
  const [waterSamples, setWaterSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit/Delete state
  const [selectedSoilSample, setSelectedSoilSample] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSamples = async () => {
    setLoading(true);
    setError(null);
    try {
      const [soilRes, waterRes] = await Promise.all([
        soilSamplesApi.getAll(),
        waterSamplesApi.getAll(),
      ]);
      setSoilSamples(
        Array.isArray(soilRes.data) ? soilRes.data : soilRes.data.results || []
      );
      setWaterSamples(
        Array.isArray(waterRes.data)
          ? waterRes.data
          : waterRes.data.results || []
      );
    } catch (err) {
      setError("Failed to load samples");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleSoilFormSuccess = () => {
    setIsSoilFormOpen(false);
    setSelectedSoilSample(null);
    fetchSamples();
  };
  
  const handleEditSoilSample = (sample: any) => {
    setSelectedSoilSample(sample);
    setIsSoilFormOpen(true);
  };

  const handleDeleteSoilSample = (sample: any) => {
    setSampleToDelete(sample);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSample = async () => {
    if (!sampleToDelete) return;
    
    setIsDeleting(true);
    try {
      await soilSamplesApi.delete(sampleToDelete.id);
      fetchSamples();
      setIsDeleteDialogOpen(false);
      setSampleToDelete(null);
    } catch (error) {
      console.error("Failed to delete sample:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWaterFormSuccess = () => {
    setIsWaterFormOpen(false);
    fetchSamples();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sampling</h1>
            <p className="text-muted-foreground">
              Manage soil and water samples
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsSoilFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Soil Sample
            </Button>
            <Button variant="outline" onClick={() => setIsWaterFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Water Sample
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading samples...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <Tabs defaultValue="soil" className="space-y-4">
            <TabsList>
              <TabsTrigger value="soil">Soil Samples</TabsTrigger>
              <TabsTrigger value="water">Water Samples</TabsTrigger>
            </TabsList>

            <TabsContent value="soil" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {soilSamples.map((sample) => (
                  <Card key={sample.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                      <CardTitle className="text-md font-medium">
                        {sample.farm_name || "Unknown Farm"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {sample.sample_date ? new Date(sample.sample_date).toLocaleDateString() : "-"}
                        </Badge>
                        <Flask className="h-4 w-4 text-green-600" />
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditSoilSample(sample)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteSoilSample(sample)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            pH:
                          </span>
                          <Badge
                            className={`${
                              sample.pH < 6.5
                                ? "bg-amber-100 text-amber-800"
                                : sample.pH > 7.5
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            } hover:bg-opacity-90`}
                          >
                            {sample.pH}
                          </Badge>
                        </div>
                        {sample.moisture_pct !== null && sample.moisture_pct !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Moisture:
                            </span>
                            <span className="text-sm font-medium">
                              {sample.moisture_pct}%
                            </span>
                          </div>
                        )}
                        {(sample.nutrient_n || sample.nutrient_p || sample.nutrient_k) && (
                          <div className="space-y-2">
                            <span className="text-sm text-muted-foreground">
                              Nutrients (NPK):
                            </span>
                            <div className="flex gap-2">
                              {sample.nutrient_n && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  N: {sample.nutrient_n}
                                </Badge>
                              )}
                              {sample.nutrient_p && (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  P: {sample.nutrient_p}
                                </Badge>
                              )}
                              {sample.nutrient_k && (
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                  K: {sample.nutrient_k}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {sample.notes && (
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Notes:
                            </span>
                            <p className="text-sm mt-1">{sample.notes}</p>
                          </div>
                        )}
                        {sample.photo && (
                          <div className="mt-3 -mx-4 -mb-4">
                            <img
                              src={getMediaUrl(sample.photo)}
                              alt="Soil sample"
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {/* <Link href={`/sampling/soil/${sample.id}`}>
                          <Button variant="outline" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {soilSamples.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-md">
                    <Flask className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No soil samples yet</p>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setIsSoilFormOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Sample
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="water" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {waterSamples.map((sample) => (
                  <Card key={sample.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                      <CardTitle className="text-md font-medium">
                        Water Sample #{sample.id}
                      </CardTitle>
                      <Droplets className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Farm:
                          </span>
                          <span className="text-sm font-medium">
                            {sample.farm_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Source:
                          </span>
                          <span className="text-sm font-medium">
                            {sample.source}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Date:
                          </span>
                          <span className="text-sm font-medium">
                            {sample.sample_date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            pH:
                          </span>
                          <Badge
                            className={`${
                              sample.pH < 6.5
                                ? "bg-amber-100 text-amber-800"
                                : sample.pH > 7.5
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            } hover:bg-opacity-90`}
                          >
                            {sample.pH}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Turbidity:
                          </span>
                          <Badge
                            className={`${
                              sample.turbidity > 15
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            } hover:bg-opacity-90`}
                          >
                            {sample.turbidity} NTU
                          </Badge>
                        </div>
                        {/* <Link href={`/sampling/water/${sample.id}`}>
                          <Button variant="outline" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Soil Sample Form Modal */}
        <SoilSampleForm
          isOpen={isSoilFormOpen}
          onClose={() => {
            setIsSoilFormOpen(false);
            setSelectedSoilSample(null);
          }}
          onSuccess={handleSoilFormSuccess}
          sample={selectedSoilSample}
        />

        {/* Water Sample Form Modal */}
        <WaterSampleForm
          isOpen={isWaterFormOpen}
          onClose={() => setIsWaterFormOpen(false)}
          onSuccess={handleWaterFormSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSampleToDelete(null);
          }}
          onConfirm={confirmDeleteSample}
          title="Delete Soil Sample"
          description="Are you sure you want to delete this soil sample? This action cannot be undone."
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          isDestructive
        />
      </div>
    </MainLayout>
  );
}
