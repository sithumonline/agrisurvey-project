import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Map, Leaf, Droplets, Bug, AlertTriangle, CheckCircle2, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe. Here's your survey overview.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">Sync Data</Button>
            <Button className="bg-green-600 hover:bg-green-700">Start New Survey</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Routes</CardTitle>
              <Map className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 completed, 4 pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farms Surveyed</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samples Collected</CardTitle>
              <Droplets className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
              <p className="text-xs text-muted-foreground">52 soil, 34 water</p>
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
