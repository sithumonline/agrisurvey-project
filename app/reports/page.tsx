"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Filter, Leaf, Map, Droplets, Bug } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Function to handle CSV export
  const handleExportCSV = (dataType: string) => {
    // In a real app, this would generate and download a CSV file
    console.log(`Exporting ${dataType} data as CSV`)

    // Mock data for demonstration
    let csvContent = ""

    switch (dataType) {
      case "farms":
        csvContent =
          'id,name,owner,size,crops,lastVisited\n1,Johnson\'s Maize Field,Robert Johnson,5.2,"Maize, Beans",Today'
        break
      case "soil":
        csvContent =
          "id,farmName,sampleDate,pH,moisture,nutrientN,nutrientP,nutrientK\n1,Johnson's Maize Field,2025-04-26,6.8,42,15,8,12"
        break
      case "water":
        csvContent = "id,location,sampleDate,pH,turbidity\n1,River Tributary #3,2025-04-18,7.1,12"
        break
      case "pests":
        csvContent = "id,type,name,farmName,reportDate,severity\n1,pest,Aphids,Johnson's Maize Field,2025-04-26,medium"
        break
      default:
        csvContent = ""
    }

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `agrisurvey_${dataType}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and export survey data reports</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <DatePicker
                  selected={dateRange.from}
                  onSelect={(date) => {
                    setDateRange((prev) => ({ ...prev, from: date }))
                  }}
                  placeholderText="From date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">&nbsp;</label>
                <DatePicker
                  selected={dateRange.to}
                  onSelect={(date) => {
                    setDateRange((prev) => ({ ...prev, to: date }))
                  }}
                  placeholderText="To date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Route</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Routes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    <SelectItem value="1">Eastern District Route</SelectItem>
                    <SelectItem value="2">Northern Farms Survey</SelectItem>
                    <SelectItem value="3">Riverside Water Sampling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="farms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="soil">Soil Samples</TabsTrigger>
            <TabsTrigger value="water">Water Samples</TabsTrigger>
            <TabsTrigger value="pests">Pests & Diseases</TabsTrigger>
          </TabsList>

          <TabsContent value="farms">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  Farm Reports
                </CardTitle>
                <Button variant="outline" className="flex items-center" onClick={() => handleExportCSV("farms")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farm Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Size (ha)</TableHead>
                      <TableHead>Crops</TableHead>
                      <TableHead>Last Visited</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Johnson's Maize Field</TableCell>
                      <TableCell>Robert Johnson</TableCell>
                      <TableCell>5.2</TableCell>
                      <TableCell>Maize, Beans</TableCell>
                      <TableCell>Today</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Green Valley Coffee Plantation</TableCell>
                      <TableCell>Maria Garcia</TableCell>
                      <TableCell>12.8</TableCell>
                      <TableCell>Coffee</TableCell>
                      <TableCell>Yesterday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Riverside Orchard</TableCell>
                      <TableCell>James Wilson</TableCell>
                      <TableCell>8.5</TableCell>
                      <TableCell>Apples, Pears</TableCell>
                      <TableCell>Apr 18, 2025</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soil">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Map className="mr-2 h-5 w-5" />
                  Soil Sample Reports
                </CardTitle>
                <Button variant="outline" className="flex items-center" onClick={() => handleExportCSV("soil")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Farm</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>pH</TableHead>
                      <TableHead>Moisture</TableHead>
                      <TableHead>NPK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#1</TableCell>
                      <TableCell>Johnson's Maize Field</TableCell>
                      <TableCell>Today</TableCell>
                      <TableCell>6.8</TableCell>
                      <TableCell>42%</TableCell>
                      <TableCell>15-8-12</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#2</TableCell>
                      <TableCell>Eastern Wheat Fields</TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>7.2</TableCell>
                      <TableCell>38%</TableCell>
                      <TableCell>12-10-14</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5" />
                  Water Sample Reports
                </CardTitle>
                <Button variant="outline" className="flex items-center" onClick={() => handleExportCSV("water")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sample ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>pH</TableHead>
                      <TableHead>Turbidity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#1</TableCell>
                      <TableCell>River Tributary #3</TableCell>
                      <TableCell>Apr 18, 2025</TableCell>
                      <TableCell>7.1</TableCell>
                      <TableCell>12 NTU</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#2</TableCell>
                      <TableCell>Irrigation Canal #2</TableCell>
                      <TableCell>Apr 15, 2025</TableCell>
                      <TableCell>6.9</TableCell>
                      <TableCell>8 NTU</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bug className="mr-2 h-5 w-5" />
                  Pest & Disease Reports
                </CardTitle>
                <Button variant="outline" className="flex items-center" onClick={() => handleExportCSV("pests")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Farm</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#1</TableCell>
                      <TableCell>Pest</TableCell>
                      <TableCell>Aphids</TableCell>
                      <TableCell>Johnson's Maize Field</TableCell>
                      <TableCell>Today</TableCell>
                      <TableCell>Medium</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#2</TableCell>
                      <TableCell>Disease</TableCell>
                      <TableCell>Powdery Mildew</TableCell>
                      <TableCell>Riverside Orchard</TableCell>
                      <TableCell>Yesterday</TableCell>
                      <TableCell>Low</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
