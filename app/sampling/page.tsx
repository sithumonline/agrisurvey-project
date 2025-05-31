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
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { SoilSampleForm } from "@/components/forms/soil-sample-form";
import { WaterSampleForm } from "@/components/forms/water-sample-form";
import { soilSamplesApi, waterSamplesApi } from "@/services/api";

export default function SamplingPage() {
  const [isSoilFormOpen, setIsSoilFormOpen] = useState(false);
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [soilSamples, setSoilSamples] = useState<any[]>([]);
  const [waterSamples, setWaterSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchSamples();
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
                        Soil Sample #{sample.id}
                      </CardTitle>
                      <Flask className="h-4 w-4 text-green-600" />
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
                            Moisture:
                          </span>
                          <span className="text-sm font-medium">
                            {sample.moisture_pct}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Nutrients:
                          </span>
                          <div className="flex space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              N: {sample.nutrient_n}
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              P: {sample.nutrient_p}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                              K: {sample.nutrient_k}
                            </Badge>
                          </div>
                        </div>
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
          onClose={() => setIsSoilFormOpen(false)}
          onSuccess={handleSoilFormSuccess}
        />

        {/* Water Sample Form Modal */}
        <WaterSampleForm
          isOpen={isWaterFormOpen}
          onClose={() => setIsWaterFormOpen(false)}
          onSuccess={handleWaterFormSuccess}
        />
      </div>
    </MainLayout>
  );
}
