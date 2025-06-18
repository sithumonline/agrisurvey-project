"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  // Edit,
  ArrowLeft,
  MapPin,
  User,
  Ruler,
  Calendar,
  Wheat,
  Droplets,
  Bug,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  Edit,
  AlertTriangle,
  AlertCircle,
  Image,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { farmsApi, cropsApi, soilSamplesApi, waterSamplesApi, pestDiseaseApi } from "@/services/api";
import { offlineApi } from "@/services/offline-api";
import { CropForm } from "@/components/forms/crop-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FarmForm } from "@/components/forms/farm-form";
import { SoilSampleForm } from "@/components/forms/soil-sample-form";
import { WaterSampleForm } from "@/components/forms/water-sample-form";
import { PestReportForm } from "@/components/forms/pest-report-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMediaUrl } from "@/lib/api-utils";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FarmMap } from "@/components/ui/farm-map";

export default function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("details");
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Crop form states
  const [isCropFormOpen, setIsCropFormOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Farm edit state
  const [isFarmFormOpen, setIsFarmFormOpen] = useState(false);
  
  // Soil sample state
  const [isSoilSampleFormOpen, setIsSoilSampleFormOpen] = useState(false);
  const [selectedSoilSample, setSelectedSoilSample] = useState<any>(null);
  const [isSoilDeleteDialogOpen, setIsSoilDeleteDialogOpen] = useState(false);
  const [soilSampleToDelete, setSoilSampleToDelete] = useState<any>(null);
  const [isDeletingSoil, setIsDeletingSoil] = useState(false);

  // Water sample state
  const [isWaterSampleFormOpen, setIsWaterSampleFormOpen] = useState(false);
  const [selectedWaterSample, setSelectedWaterSample] = useState<any>(null);
  const [isWaterDeleteDialogOpen, setIsWaterDeleteDialogOpen] = useState(false);
  const [waterSampleToDelete, setWaterSampleToDelete] = useState<any>(null);
  const [isDeletingWater, setIsDeletingWater] = useState(false);
  
  // Pest/Disease report state
  const [isPestReportFormOpen, setIsPestReportFormOpen] = useState(false);
  const [selectedPestReport, setSelectedPestReport] = useState<any>(null);
  const [isPestDeleteDialogOpen, setIsPestDeleteDialogOpen] = useState(false);
  const [pestReportToDelete, setPestReportToDelete] = useState<any>(null);
  const [isDeletingPest, setIsDeletingPest] = useState(false);

  const fetchFarmDetails = () => {
    setLoading(true);
    farmsApi
      .getById(id)
      .then((res) => {
        setFarm(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load farm details");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFarmDetails();
  }, [id]);

  const handleAddCrop = () => {
    setSelectedCrop(null);
    setIsCropFormOpen(true);
  };

  const handleEditCrop = (crop: any) => {
    setSelectedCrop(crop);
    setIsCropFormOpen(true);
  };

  const handleDeleteCrop = (crop: any) => {
    setCropToDelete(crop);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCrop = async () => {
    if (!cropToDelete) return;
    
    setIsDeleting(true);
    try {
      await offlineApi.crops.delete(cropToDelete.id);
      // Refresh farm details
      fetchFarmDetails();
      setIsDeleteDialogOpen(false);
      setCropToDelete(null);
    } catch (error) {
      console.error("Failed to delete crop:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCropFormSuccess = () => {
    setIsCropFormOpen(false);
    setSelectedCrop(null);
    // Refresh farm details to show new/updated crop
    fetchFarmDetails();
  };

  const handleFarmFormSuccess = () => {
    setIsFarmFormOpen(false);
    // Refresh farm details to show updates
    fetchFarmDetails();
  };

  const handleSoilSampleSuccess = () => {
    setIsSoilSampleFormOpen(false);
    setSelectedSoilSample(null);
    // Refresh farm details to show new sample
    fetchFarmDetails();
  };

  const handleEditSoilSample = (sample: any) => {
    setSelectedSoilSample(sample);
    setIsSoilSampleFormOpen(true);
  };

  const handleDeleteSoilSample = (sample: any) => {
    setSoilSampleToDelete(sample);
    setIsSoilDeleteDialogOpen(true);
  };

  const confirmDeleteSoilSample = async () => {
    if (!soilSampleToDelete) return;
    
    setIsDeletingSoil(true);
    try {
      await offlineApi.soilSamples.delete(soilSampleToDelete.id);
      fetchFarmDetails(); // Refresh the farm details
      setIsSoilDeleteDialogOpen(false);
      setSoilSampleToDelete(null);
    } catch (error) {
      console.error("Failed to delete soil sample:", error);
    } finally {
      setIsDeletingSoil(false);
    }
  };

  const handleWaterSampleSuccess = () => {
    setIsWaterSampleFormOpen(false);
    setSelectedWaterSample(null);
    // Refresh farm details to show new sample
    fetchFarmDetails();
  };

  const handleEditWaterSample = (sample: any) => {
    setSelectedWaterSample(sample);
    setIsWaterSampleFormOpen(true);
  };

  const handleDeleteWaterSample = (sample: any) => {
    setWaterSampleToDelete(sample);
    setIsWaterDeleteDialogOpen(true);
  };

  const confirmDeleteWaterSample = async () => {
    if (!waterSampleToDelete) return;
    
    setIsDeletingWater(true);
    try {
      await offlineApi.waterSamples.delete(waterSampleToDelete.id);
      fetchFarmDetails(); // Refresh the farm details
      setIsWaterDeleteDialogOpen(false);
      setWaterSampleToDelete(null);
    } catch (error) {
      console.error("Failed to delete water sample:", error);
    } finally {
      setIsDeletingWater(false);
    }
  };

  const handlePestReportSuccess = () => {
    setIsPestReportFormOpen(false);
    setSelectedPestReport(null);
    // Refresh farm details to show new/updated report
    fetchFarmDetails();
  };

  const handleEditPestReport = (report: any) => {
    setSelectedPestReport(report);
    setIsPestReportFormOpen(true);
  };

  const handleDeletePestReport = (report: any) => {
    setPestReportToDelete(report);
    setIsPestDeleteDialogOpen(true);
  };

  const confirmDeletePestReport = async () => {
    if (!pestReportToDelete) return;
    
    setIsDeletingPest(true);
    try {
      await offlineApi.pestDisease.delete(pestReportToDelete.id);
      fetchFarmDetails(); // Refresh the farm details
      setIsPestDeleteDialogOpen(false);
      setPestReportToDelete(null);
    } catch (error) {
      console.error("Failed to delete pest/disease report:", error);
    } finally {
      setIsDeletingPest(false);
    }
  };

  const handleQuickComplete = async () => {
    if (!farm || farm.has_samples || farm.has_pest_reports) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // Create a default soil sample to mark the farm as complete
      const defaultSoilSample = {
        farm: id,
        sample_date: new Date().toISOString().split('T')[0],
        pH: 7.0,
        moisture_pct: 40,
        nitrogen: 15,
        phosphorus: 10,
        potassium: 12,
        notes: 'Quick completion sample for testing'
      };
      
      const formData = new FormData();
      Object.entries(defaultSoilSample).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      await soilSamplesApi.create(formData);
      
      // Refresh farm data
      await fetchFarmDetails();
    } catch (err: any) {
      console.error('Error quick completing farm:', err);
      setError('Failed to quick complete farm');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-10 text-muted-foreground">
          Loading farm details...
        </div>
      </MainLayout>
    );
  }

  if (error || !farm) {
    return (
      <MainLayout>
        <div className="text-center py-10 text-red-500">
          {error || "Farm not found"}
        </div>
      </MainLayout>
    );
  }

  const isComplete = farm.has_samples || farm.has_pest_reports;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Link href="/farms">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{farm.name}</h1>
              <p className="text-muted-foreground">Farm ID: {farm.id}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {!isComplete && (
              <Button 
                variant="outline"
                onClick={handleQuickComplete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Quick Complete
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => setIsFarmFormOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Farm
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="details">Farm Details</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="pests">Pests & Diseases</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Owner</span>
                    </div>
                    <p>{farm.owner_name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Size</span>
                    </div>
                    <p>{farm.size_ha} hectares</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p>{farm.location}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Coordinates</span>
                    </div>
                    <p>
                      {farm.boundary_geo
                        ? JSON.stringify(farm.boundary_geo)
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Last Visited</span>
                    </div>
                    <p>
                      {farm.updated_at
                        ? new Date(farm.updated_at).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farm Map</CardTitle>
              </CardHeader>
              <CardContent>
                <FarmMap 
                  latitude={farm.latitude}
                  longitude={farm.longitude}
                  sizeHa={farm.size_ha}
                  farmName={farm.name}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Crops Information</h3>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleAddCrop}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Crop
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(farm.crops || []).map((crop: any, index: number) => (
                <Card key={crop.id || index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">
                      {crop.crop_type}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Wheat className="h-4 w-4 text-green-600" />
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditCrop(crop)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCrop(crop)}
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
                          Variety:
                        </span>
                        <span className="text-sm font-medium">
                          {crop.variety || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Planting Date:
                        </span>
                        <span className="text-sm font-medium">
                          {crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Expected Harvest:
                        </span>
                        <span className="text-sm font-medium">
                          {crop.expected_harvest ? new Date(crop.expected_harvest).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(farm.crops || []).length === 0 && (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-md">
                  <Wheat className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No crops for this farm</p>
                  <Button 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={handleAddCrop}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Crop
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="samples" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Soil & Water Samples</h3>
              <div className="flex space-x-2">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsSoilSampleFormOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Soil Sample
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsWaterSampleFormOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Water Sample
                </Button>
              </div>
            </div>

            <h4 className="text-md font-medium mt-4">Soil Samples</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {(farm.soil_samples || []).map((sample: any) => (
                <Card key={sample.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">
                      Soil Sample
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {sample.sample_date ? new Date(sample.sample_date).toLocaleDateString() : "No date"}
                      </Badge>
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
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            NPK:
                          </span>
                          <span className="text-sm font-medium">
                            {[
                              sample.nutrient_n && `N:${sample.nutrient_n}`,
                              sample.nutrient_p && `P:${sample.nutrient_p}`,
                              sample.nutrient_k && `K:${sample.nutrient_k}`
                            ].filter(Boolean).join(" ")}
                          </span>
                        </div>
                      )}
                      {sample.photo && (
                        <div className="mt-2">
                          <img
                            src={getMediaUrl(sample.photo)}
                            alt="Soil sample"
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {/* <Link href={`/sampling/soil/${sample.id}`}>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(farm.soil_samples || []).length === 0 && (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-md">
                  <Droplets className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No soil samples for this farm</p>
                  <Button 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setIsSoilSampleFormOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Sample
                  </Button>
                </div>
              )}
            </div>

            <h4 className="text-md font-medium mt-4">Water Samples</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {(farm.water_samples || []).map((sample: any) => (
                <Card key={sample.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">
                      {sample.source || "Water Sample"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {sample.sample_date ? new Date(sample.sample_date).toLocaleDateString() : "No date"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditWaterSample(sample)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteWaterSample(sample)}
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
                      {sample.turbidity !== null && sample.turbidity !== undefined && (
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
                      )}
                      {sample.photo && (
                        <div className="mt-2">
                          <img
                            src={getMediaUrl(sample.photo)}
                            alt="Water sample"
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {/* <Link href={`/sampling/water/${sample.id}`}>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(farm.water_samples || []).length === 0 && (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-md">
                  <Droplets className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No water samples for this farm
                  </p>
                  <Button 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setIsWaterSampleFormOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Sample
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pest & Disease Reports</h3>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsPestReportFormOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(farm.pest_disease_reports || []).map((report: any) => (
                <Card key={report.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">
                      {report.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          report.category === 'pest' 
                            ? 'border-orange-500 text-orange-700' 
                            : 'border-purple-500 text-purple-700'
                        }`}
                      >
                        {report.category_display || report.category}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditPestReport(report)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePestReport(report)}
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
                          Date:
                        </span>
                        <span className="text-sm font-medium">
                          {report.report_date 
                            ? new Date(report.report_date).toLocaleDateString() 
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Severity:
                        </span>
                        <Badge
                          className={`${
                            report.severity === "high"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : report.severity === "medium"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                          }`}
                        >
                          {report.severity === "high" && (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {report.severity_display || report.severity}
                        </Badge>
                      </div>
                      {report.description && (
                        <div className="text-sm text-gray-600">
                          {report.description}
                        </div>
                      )}
                      {report.photo && (
                        <div className="mt-2">
                          <img
                            src={getMediaUrl(report.photo)}
                            alt={`${report.name} photo`}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(farm.pest_disease_reports || []).length === 0 && (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-md">
                  <Bug className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No pest or disease reports for this farm
                  </p>
                  <Button 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setIsPestReportFormOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Report
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Crop Form Modal */}
        <CropForm
          isOpen={isCropFormOpen}
          onClose={() => {
            setIsCropFormOpen(false);
            setSelectedCrop(null);
          }}
          onSuccess={handleCropFormSuccess}
          farmId={id}
          crop={selectedCrop}
        />
        
        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setCropToDelete(null);
          }}
          onConfirm={confirmDeleteCrop}
          title="Delete Crop"
          description={`Are you sure you want to delete "${cropToDelete?.crop_type}"? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          isDestructive
        />

        {/* Farm Form Modal */}
        <FarmForm
          isOpen={isFarmFormOpen}
          onClose={() => setIsFarmFormOpen(false)}
          onSuccess={handleFarmFormSuccess}
          farmData={farm}
        />

        {/* Soil Sample Form Modal */}
        <SoilSampleForm
          isOpen={isSoilSampleFormOpen}
          onClose={() => {
            setIsSoilSampleFormOpen(false);
            setSelectedSoilSample(null);
          }}
          onSuccess={handleSoilSampleSuccess}
          farmId={id}
          sample={selectedSoilSample}
        />

        {/* Soil Sample Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isSoilDeleteDialogOpen}
          onClose={() => {
            setIsSoilDeleteDialogOpen(false);
            setSoilSampleToDelete(null);
          }}
          onConfirm={confirmDeleteSoilSample}
          title="Delete Soil Sample"
          description={`Are you sure you want to delete this soil sample? This action cannot be undone.`}
          confirmText={isDeletingSoil ? "Deleting..." : "Delete"}
          isDestructive
        />

        {/* Water Sample Form Modal */}
        <WaterSampleForm
          isOpen={isWaterSampleFormOpen}
          onClose={() => {
            setIsWaterSampleFormOpen(false);
            setSelectedWaterSample(null);
          }}
          onSuccess={handleWaterSampleSuccess}
          farmId={id}
          sample={selectedWaterSample}
        />

        {/* Water Sample Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isWaterDeleteDialogOpen}
          onClose={() => {
            setIsWaterDeleteDialogOpen(false);
            setWaterSampleToDelete(null);
          }}
          onConfirm={confirmDeleteWaterSample}
          title="Delete Water Sample"
          description={`Are you sure you want to delete this water sample? This action cannot be undone.`}
          confirmText={isDeletingWater ? "Deleting..." : "Delete"}
          isDestructive
        />
        
        {/* Pest Report Form Modal */}
        <PestReportForm
          isOpen={isPestReportFormOpen}
          onClose={() => {
            setIsPestReportFormOpen(false);
            setSelectedPestReport(null);
          }}
          onSuccess={handlePestReportSuccess}
          farmId={id}
          report={selectedPestReport}
        />
        
        {/* Pest Report Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isPestDeleteDialogOpen}
          onClose={() => {
            setIsPestDeleteDialogOpen(false);
            setPestReportToDelete(null);
          }}
          onConfirm={confirmDeletePestReport}
          title="Delete Pest/Disease Report"
          description={`Are you sure you want to delete "${pestReportToDelete?.name}"? This action cannot be undone.`}
          confirmText={isDeletingPest ? "Deleting..." : "Delete"}
          isDestructive
        />
      </div>
    </MainLayout>
  );
}
