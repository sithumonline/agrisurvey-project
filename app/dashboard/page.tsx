'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Map, Leaf, Droplets, Bug, AlertTriangle, CheckCircle2, Clock, ArrowRight, RefreshCw, WifiOff } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"
import { dashboardApi } from "@/services/api"
import {use, useEffect, useState} from "react"; // Import the dashboard API service
import { useOfflineStatus } from "@/hooks/use-offline-status";
import { Badge } from "@/components/ui/badge";


export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]  = useState<string|null>(null);
  const { isOnline, queueCount, syncStatus, syncOfflineData } = useOfflineStatus();

useEffect(()=>{
  // fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardApi.getData();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, []);


  if (isLoading) {
    return (
        <MainLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </MainLayout>
    )
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
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {dashboardData?.user?.name}. Here's your survey overview.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">

            <Button 
              variant="outline" 
              onClick={syncOfflineData}
              disabled={syncStatus?.status === 'syncing' || queueCount === 0}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncStatus?.status === 'syncing' ? 'animate-spin' : ''}`} />
              Sync Data
              {queueCount > 0 && (
                <Badge variant="secondary" className="ml-2">{queueCount}</Badge>
              )}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Start New Survey</Button>
          </div>
        </div>

        {/* Offline/Sync Status Alert */}
        {(!isOnline || queueCount > 0) && (
          <Alert className={!isOnline ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}>
            {!isOnline ? (
              <>
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Working Offline</AlertTitle>
                <AlertDescription>
                  You're currently offline. Your data is being saved locally and will sync when connection is restored.
                </AlertDescription>
              </>
            ) : queueCount > 0 ? (
              <>
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Pending Sync</AlertTitle>
                <AlertDescription>
                  {queueCount} {queueCount === 1 ? 'update is' : 'updates are'} waiting to be synced. 
                  {syncStatus?.status === 'syncing' 
                    ? ` Syncing... ${syncStatus.completed}/${syncStatus.total} completed.`
                    : ' Click "Sync Data" to sync now.'}
                </AlertDescription>
              </>
            ) : null}
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Routes</CardTitle>
              <Map className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.route?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">{dashboardData?.route?.completed || 0} completed, {dashboardData?.route?.pending || 0} pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farms Surveyed</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.farms?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {
                  dashboardData?.activity && dashboardData?.activity.length > 0 ?
                      dashboardData?.activity.filter((e: any)=>{return e.type == 'farm'}).map((e: any)=>{
                        return <span key={e.id}>{e.name}, </span>
                      })
                      : 'Nothing new'
                }

              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samples Collected</CardTitle>
              <Droplets className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(dashboardData?.sampling?.soil?.total || 0) + (dashboardData?.sampling?.water?.total || 0)}
              </div>
              <p className="text-xs text-muted-foreground">{dashboardData?.sampling?.soil?.total || 0} soil, {dashboardData?.sampling?.water?.total || 0} water</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pest Reports</CardTitle>
              <Bug className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">5 high severity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Eastern District Route</div>
                    <div className="text-green-600">75%</div>
                  </div>
                  <Progress value={75} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Northern Farms Survey</div>
                    <div className="text-green-600">45%</div>
                  </div>
                  <Progress value={45} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Riverside Water Sampling</div>
                    <div className="text-green-600">90%</div>
                  </div>
                  <Progress value={90} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                </div>
                <div className="pt-2">
                  <Link href="/routes">
                    <Button variant="outline" className="w-full">
                      View All Routes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Recent notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>High Severity Pest Alert</AlertTitle>
                  <AlertDescription>Armyworm outbreak detected in Northern District.</AlertDescription>
                </Alert>
                <Alert className="bg-amber-50 border-amber-200">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Pending Submission</AlertTitle>
                  <AlertDescription>3 surveys are waiting to be synced.</AlertDescription>
                </Alert>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Completed</AlertTitle>
                  <AlertDescription>Eastern District soil sampling completed.</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="farms">Farms</TabsTrigger>
                <TabsTrigger value="samples">Samples</TabsTrigger>
                <TabsTrigger value="pests">Pests & Diseases</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Added Farm: Johnson's Maize Field</div>
                    <div className="text-sm text-muted-foreground">Today at 10:30 AM</div>
                  </div>
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Soil Sample: Eastern District Plot #12</div>
                    <div className="text-sm text-muted-foreground">Yesterday at 3:45 PM</div>
                  </div>
                  <Droplets className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Pest Report: Aphids on Tomato Plants</div>
                    <div className="text-sm text-muted-foreground">Apr 19, 2025 at 11:20 AM</div>
                  </div>
                  <Bug className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Water Sample: River Tributary #3</div>
                    <div className="text-sm text-muted-foreground">Apr 18, 2025 at 9:15 AM</div>
                  </div>
                  <Droplets className="h-4 w-4 text-green-600" />
                </div>
              </TabsContent>
              <TabsContent value="farms">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Added Farm: Johnson's Maize Field</div>
                    <div className="text-sm text-muted-foreground">Today at 10:30 AM</div>
                  </div>
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
              </TabsContent>
              <TabsContent value="samples">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Soil Sample: Eastern District Plot #12</div>
                    <div className="text-sm text-muted-foreground">Yesterday at 3:45 PM</div>
                  </div>
                  <Droplets className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Water Sample: River Tributary #3</div>
                    <div className="text-sm text-muted-foreground">Apr 18, 2025 at 9:15 AM</div>
                  </div>
                  <Droplets className="h-4 w-4 text-green-600" />
                </div>
              </TabsContent>
              <TabsContent value="pests">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Pest Report: Aphids on Tomato Plants</div>
                    <div className="text-sm text-muted-foreground">Apr 19, 2025 at 11:20 AM</div>
                  </div>
                  <Bug className="h-4 w-4 text-green-600" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
