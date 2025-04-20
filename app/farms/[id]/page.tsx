"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft, MapPin, User, Ruler, Calendar, Wheat, Droplets, Bug, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"

export default function FarmDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  // Mock farm data
  const farm = {
    id: params.id,
    name: "Johnson's Maize Field",
    owner: "Robert Johnson",
    size: 5.2,
    crops: [
      { name: "Maize", variety: "Pioneer P1234", plantingDate: "Mar 15, 2025", harvestDate: "Jul 20, 2025" },
      { name: "Beans", variety: "Red Kidney", plantingDate: "Mar 20, 2025", harvestDate: "Jun 30, 2025" },
    ],
    location: "Eastern District, Plot 12",
    coordinates: "1.2345° N, 36.7890° E",
    lastVisited: "Today",
    soilSamples: [
      { id: "1", date: "Today", pH: 6.8, moisture: 42 },
      { id: "2", date: "Apr 10, 2025", pH: 6.7, moisture: 38 },
    ],
    waterSamples: [{ id: "1", date: "Apr 12, 2025", source: "Irrigation Canal", pH: 7.1 }],
    pestReports: [{ id: "1", date: "Today", name: "Aphids", severity: "medium" }],
  }

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
          <Button className="mt-4 md:mt-0" variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Farm
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                    <p>{farm.owner}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Size</span>
                    </div>
                    <p>{farm.size} hectares</p>
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
                    <p>{farm.coordinates}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Last Visited</span>
                    </div>
                    <p>{farm.lastVisited}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farm Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center">
                  <p className="text-gray-500">Farm boundary map would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Crops Information</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Crop
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {farm.crops.map((crop, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">{crop.name}</CardTitle>
                    <Wheat className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Variety:</span>
                        <span className="text-sm font-medium">{crop.variety}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Planting Date:</span>
                        <span className="text-sm font-medium">{crop.plantingDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Expected Harvest:</span>
                        <span className="text-sm font-medium">{crop.harvestDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="samples" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Soil & Water Samples</h3>
              <div className="flex space-x-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Soil Sample
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New Water Sample
                </Button>
              </div>
            </div>

            <h4 className="text-md font-medium mt-4">Soil Samples</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {farm.soilSamples.map((sample) => (
                <Card key={sample.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">Soil Sample #{sample.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{sample.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">pH:</span>
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
                        <span className="text-sm text-muted-foreground">Moisture:</span>
                        <span className="text-sm font-medium">{sample.moisture}%</span>
                      </div>
                      <Link href={`/sampling/soil/${sample.id}`}>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h4 className="text-md font-medium mt-4">Water Samples</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {farm.waterSamples.map((sample) => (
                <Card key={sample.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">Water Sample #{sample.id}</CardTitle>
                    <Droplets className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{sample.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Source:</span>
                        <span className="text-sm font-medium">{sample.source}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">pH:</span>
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
                      <Link href={`/sampling/water/${sample.id}`}>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pest & Disease Reports</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {farm.pestReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">{report.name}</CardTitle>
                    <Bug className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{report.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Severity:</span>
                        <Badge
                          className={`${
                            report.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : report.severity === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                          } hover:bg-opacity-90`}
                        >
                          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                        </Badge>
                      </div>
                      <Link href={`/pests/${report.id}`}>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {farm.pestReports.length === 0 && (
                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-md">
                  <Bug className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No pest or disease reports for this farm</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
