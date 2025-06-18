'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Map,
  Leaf,
  Droplets,
  Bug,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { dashboardApi, routesApi, farmsApi } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from 'next/navigation';

interface CompletionStats {
  routes: {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  };
  farms: {
    total: number;
    surveyed: number;
    completionRate: number;
  };
  samples: {
    soil: number;
    water: number;
    total: number;
  };
  pestReports: number;
}

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [routeDetails, setRouteDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 seconds
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [dashboardRes, routesRes, farmsRes] = await Promise.all([
        dashboardApi.getData(),
        routesApi.getAll(),
        farmsApi.getAll()
      ]);

      const dashboard = dashboardRes.data;
      const routes = routesRes.data.results || routesRes.data;
      const farms = farmsRes.data.results || farmsRes.data;

      // Calculate route completion rates
      const routeStats = routes.map((route: any) => {
        const assignedFarms = farms.filter((farm: any) => farm.route === route.id);
        const surveyedFarms = assignedFarms.filter((farm: any) => {
          // Check if farm has samples or pest reports
          return farm.has_samples || farm.has_pest_reports;
        });

        return {
          ...route,
          totalFarms: assignedFarms.length,
          surveyedFarms: surveyedFarms.length,
          completionRate: assignedFarms.length > 0 
            ? Math.round((surveyedFarms.length / assignedFarms.length) * 100)
            : 0
        };
      });

      setRouteDetails(routeStats);

      // Calculate overall statistics
      const completedRoutes = routeStats.filter((r: any) => r.completionRate === 100).length;
      const inProgressRoutes = routeStats.filter((r: any) => r.completionRate > 0 && r.completionRate < 100).length;
      const surveyedFarms = farms.filter((f: any) => f.has_samples || f.has_pest_reports).length;

      const stats: CompletionStats = {
        routes: {
          total: routes.length,
          completed: completedRoutes,
          inProgress: inProgressRoutes,
          completionRate: routes.length > 0 
            ? Math.round((completedRoutes / routes.length) * 100)
            : 0
        },
        farms: {
          total: farms.length,
          surveyed: surveyedFarms,
          completionRate: farms.length > 0 
            ? Math.round((surveyedFarms / farms.length) * 100)
            : 0
        },
        samples: {
          soil: dashboard.sampling?.soil?.total || 0,
          water: dashboard.sampling?.water?.total || 0,
          total: (dashboard.sampling?.soil?.total || 0) + (dashboard.sampling?.water?.total || 0)
        },
        pestReports: dashboard.pest_reports?.total || 0
      };

      setStats(stats);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    if (isAdmin) {
      fetchData();
      
      // Set up auto-refresh
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isAdmin, refreshInterval]);

  if (authLoading || isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={fetchData}>
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Survey completion rates and overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <select 
              className="px-3 py-2 border rounded-md text-sm"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            >
              <option value={10000}>Refresh every 10s</option>
              <option value={30000}>Refresh every 30s</option>
              <option value={60000}>Refresh every 1m</option>
              <option value={300000}>Refresh every 5m</option>
            </select>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Now
            </Button>
            <Link href="/reports">
              <Button className="bg-green-600 hover:bg-green-700">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Completion</CardTitle>
              <Map className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.routes.completionRate || 0}%</div>
              <Progress value={stats?.routes.completionRate || 0} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.routes.completed || 0} of {stats?.routes.total || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farm Coverage</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.farms.completionRate || 0}%</div>
              <Progress value={stats?.farms.completionRate || 0} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.farms.surveyed || 0} of {stats?.farms.total || 0} surveyed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samples Collected</CardTitle>
              <Droplets className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.samples.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.samples.soil || 0} soil, {stats?.samples.water || 0} water
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pest Reports</CardTitle>
              <Bug className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pestReports || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Total reports filed</p>
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        <Card>
          <CardHeader>
            <CardTitle>Route Completion Details</CardTitle>
            <CardDescription>Per-route survey progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {routeDetails.map((route) => (
                <div key={route.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {route.surveyedFarms} of {route.totalFarms} farms surveyed
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{route.completionRate}%</span>
                      {route.completionRate === 100 && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <Progress value={route.completionRate} className="h-2" />
                </div>
              ))}
              {routeDetails.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No routes found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Activity</CardTitle>
            <CardDescription>Real-time updates every {refreshInterval / 1000} seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="incomplete">Incomplete Routes</TabsTrigger>
                <TabsTrigger value="completed">Completed Routes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Progress</p>
                      <p className="text-2xl font-bold">{stats?.routes.completionRate || 0}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Routes</p>
                      <p className="text-2xl font-bold">{stats?.routes.completed || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RefreshCw className="h-8 w-8 text-amber-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{stats?.routes.inProgress || 0}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="incomplete" className="mt-4">
                <div className="space-y-2">
                  {routeDetails
                    .filter(r => r.completionRate < 100)
                    .map(route => (
                      <div key={route.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {route.totalFarms - route.surveyedFarms} farms remaining
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{route.completionRate}%</p>
                          <p className="text-sm text-muted-foreground">
                            {route.surveyedFarms}/{route.totalFarms}
                          </p>
                        </div>
                      </div>
                    ))}
                  {routeDetails.filter(r => r.completionRate < 100).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">All routes completed!</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="space-y-2">
                  {routeDetails
                    .filter(r => r.completionRate === 100)
                    .map(route => (
                      <div key={route.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <p className="text-sm text-muted-foreground">{route.totalFarms} farms surveyed</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                  {routeDetails.filter(r => r.completionRate === 100).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No completed routes yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 