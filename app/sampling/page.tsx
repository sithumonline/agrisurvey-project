import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Droplets, Plus, ArrowRight, FlaskRoundIcon as Flask } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"

export default function SamplingPage() {
  // Mock data for soil samples
  const soilSamples = [
    {
      id: "1",
      farmName: "Johnson's Maize Field",
      sampleDate: "Today",
      pH: 6.8,
      moisture: 42,
      nutrients: { N: 15, P: 8, K: 12 },
    },
    {
      id: "2",
      farmName: "Eastern Wheat Fields",
      sampleDate: "Yesterday",
      pH: 7.2,
      moisture: 38,
      nutrients: { N: 12, P: 10, K: 14 },
    },
    {
      id: "3",
      farmName: "Riverside Orchard",
      sampleDate: "Apr 18, 2025",
      pH: 6.5,
      moisture: 45,
      nutrients: { N: 18, P: 7, K: 9 },
    },
  ]

  // Mock data for water samples
  const waterSamples = [
    {
      id: "1",
      location: "River Tributary #3",
      sampleDate: "Apr 18, 2025",
      pH: 7.1,
      turbidity: 12,
    },
    {
      id: "2",
      location: "Irrigation Canal #2",
      sampleDate: "Apr 15, 2025",
      pH: 6.9,
      turbidity: 8,
    },
    {
      id: "3",
      location: "Farm Pond - Johnson's",
      sampleDate: "Apr 12, 2025",
      pH: 7.4,
      turbidity: 15,
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sampling</h1>
            <p className="text-muted-foreground">Manage soil and water samples</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
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
                    <CardTitle className="text-md font-medium">Soil Sample #{sample.id}</CardTitle>
                    <Flask className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Farm:</span>
                        <span className="text-sm font-medium">{sample.farmName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{sample.sampleDate}</span>
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Nutrients:</span>
                        <div className="flex space-x-2">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">N: {sample.nutrients.N}</Badge>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            P: {sample.nutrients.P}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                            K: {sample.nutrients.K}
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/sampling/soil/${sample.id}`}>
                        <Button variant="outline" className="w-full">
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

          <TabsContent value="water" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {waterSamples.map((sample) => (
                <Card key={sample.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                    <CardTitle className="text-md font-medium">Water Sample #{sample.id}</CardTitle>
                    <Droplets className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{sample.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{sample.sampleDate}</span>
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
                        <span className="text-sm text-muted-foreground">Turbidity:</span>
                        <Badge
                          className={`${
                            sample.turbidity > 15 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                          } hover:bg-opacity-90`}
                        >
                          {sample.turbidity} NTU
                        </Badge>
                      </div>
                      <Link href={`/sampling/water/${sample.id}`}>
                        <Button variant="outline" className="w-full">
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
        </Tabs>
      </div>
    </MainLayout>
  )
}
