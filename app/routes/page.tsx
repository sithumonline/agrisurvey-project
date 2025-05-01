"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, Plus, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"
import { RouteForm } from "@/components/forms/route-form"
import { routesApi } from "@/services/api" // Import the routes API service

export default function RoutesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch routes from the API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const response = await routesApi.getAll();
        setRoutes(response.data.results || response.data || []); // Handle both paginated and non-paginated responses
        setError(null);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError("Failed to load routes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getStatusBadge = (status) => {
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

  // Handle form submission success
  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    // Refresh routes
    try {
      const response = await routesApi.getAll();
      setRoutes(response.data.results || response.data || []);
    } catch (err) {
      console.error("Failed to refresh routes:", err);
    }
  };

  if (isLoading) {
    return (
        <MainLayout>
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </MainLayout>
    );
  }

  if (error) {
    return (
        <MainLayout>
          <div className="p-6">
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </MainLayout>
    );
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

          {routes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Map className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No routes found</h3>
                <p className="text-gray-500 mt-1">Get started by creating a new route.</p>
                <Button
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setIsFormOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Route
                </Button>
              </div>
          ) : (
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
                            <span className="text-sm font-medium">
                        {new Date(route.date_assigned).toLocaleDateString()}
                      </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            {getStatusBadge(route.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Farms:</span>
                            <span className="text-sm font-medium">
                        {route.completed_farms || 0} of {route.farm_count || 0} completed
                      </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${route.progress || 0}%` }}
                            ></div>
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
          )}

          {/* Route Form Modal */}
          <RouteForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSuccess={handleFormSuccess}
          />
        </div>
      </MainLayout>
  )
}
