"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, Plus, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"
import { RouteForm } from "@/components/forms/route-form"

export default function RoutesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Mock data for routes
  const routes = [
    {
      id: "1",
      name: "Eastern District Route",
      assignedDate: "Apr 15, 2025",
      status: "in_progress",
      progress: 75,
      farms: 12,
      completed: 9,
    },
    {
      id: "2",
      name: "Northern Farms Survey",
      assignedDate: "Apr 17, 2025",
      status: "in_progress",
      progress: 45,
      farms: 8,
      completed: 4,
    },
    {
      id: "3",
      name: "Riverside Water Sampling",
      assignedDate: "Apr 10, 2025",
      status: "in_progress",
      progress: 90,
      farms: 5,
      completed: 4,
    },
    {
      id: "4",
      name: "Southern District Route",
      assignedDate: "Apr 5, 2025",
      status: "complete",
      progress: 100,
      farms: 10,
      completed: 10,
    },
    {
      id: "5",
      name: "Western Highlands Survey",
      assignedDate: "Apr 22, 2025",
      status: "pending",
      progress: 0,
      farms: 15,
      completed: 0,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Complete
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Routes</h1>
            <p className="text-muted-foreground">Manage your assigned survey routes</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Route
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <Card key={route.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                <CardTitle className="text-md font-medium">{route.name}</CardTitle>
                <Map className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assigned:</span>
                    <span className="text-sm font-medium">{route.assignedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {getStatusBadge(route.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Farms:</span>
                    <span className="text-sm font-medium">
                      {route.completed} of {route.farms} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${route.progress}%` }}></div>
                  </div>
                  <Link href={`/routes/${route.id}`}>
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

        {/* Route Form Modal */}
        <RouteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </MainLayout>
  )
}
