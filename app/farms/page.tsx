import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Leaf, Plus, Search, ArrowRight, Wheat, Coffee, Apple } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"

export default function FarmsPage() {
  // Mock data for farms
  const farms = [
    {
      id: "1",
      name: "Johnson's Maize Field",
      owner: "Robert Johnson",
      size: 5.2,
      crops: ["Maize", "Beans"],
      cropIcon: Wheat,
      lastVisited: "Today",
    },
    {
      id: "2",
      name: "Green Valley Coffee Plantation",
      owner: "Maria Garcia",
      size: 12.8,
      crops: ["Coffee"],
      cropIcon: Coffee,
      lastVisited: "Yesterday",
    },
    {
      id: "3",
      name: "Riverside Orchard",
      owner: "James Wilson",
      size: 8.5,
      crops: ["Apples", "Pears"],
      cropIcon: Apple,
      lastVisited: "Apr 18, 2025",
    },
    {
      id: "4",
      name: "Eastern Wheat Fields",
      owner: "Sarah Thompson",
      size: 15.3,
      crops: ["Wheat"],
      cropIcon: Wheat,
      lastVisited: "Apr 15, 2025",
    },
    {
      id: "5",
      name: "Hillside Vegetable Farm",
      owner: "David Chen",
      size: 3.7,
      crops: ["Tomatoes", "Peppers", "Onions"],
      cropIcon: Leaf,
      lastVisited: "Apr 12, 2025",
    },
    {
      id: "6",
      name: "Sunny Slopes Vineyard",
      owner: "Elena Rodriguez",
      size: 9.2,
      crops: ["Grapes"],
      cropIcon: Leaf,
      lastVisited: "Apr 10, 2025",
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Farms</h1>
            <p className="text-muted-foreground">View and manage surveyed farms</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <Card key={farm.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                <CardTitle className="text-md font-medium">{farm.name}</CardTitle>
                <farm.cropIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Owner:</span>
                    <span className="text-sm font-medium">{farm.owner}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span className="text-sm font-medium">{farm.size} hectares</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Crops:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {farm.crops.map((crop) => (
                        <Badge key={crop} className="bg-green-100 text-green-800 hover:bg-green-100">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last visited:</span>
                    <span className="text-sm font-medium">{farm.lastVisited}</span>
                  </div>
                  <Link href={`/farms/${farm.id}`}>
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
      </div>
    </MainLayout>
  )
}
