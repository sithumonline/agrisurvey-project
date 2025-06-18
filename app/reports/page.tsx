"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Filter, Leaf, Map, Droplets, Bug, Download, RefreshCw, AlertTriangle, FileSpreadsheet, Shield, Calendar, Database } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { exportApi } from "@/services/api"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExportItem {
  id: string;
  title: string;
  description: string;
  endpoint: keyof typeof exportApi;
  icon: React.ReactNode;
}

export default function ReportsPage() { 
  const { user, isAdmin, isLoading: authLoading } = useAuth()
  const [isExporting, setIsExporting] = useState<{[key: string]: boolean}>({})
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [authLoading, isAdmin, router])

  const exportItems: ExportItem[] = [
    {
      id: 'farms',
      title: 'Farms Data',
      description: 'Export all farm records including location, owner, and size information',
      endpoint: 'farms',
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      id: 'soil-samples',
      title: 'Soil Samples',
      description: 'Export soil sample data with pH, moisture, and nutrient levels',
      endpoint: 'soilSamples',
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      id: 'water-samples',
      title: 'Water Samples',
      description: 'Export water sample data including pH, turbidity, and bacteria presence',
      endpoint: 'waterSamples',
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      id: 'pest-disease',
      title: 'Pest & Disease Reports',
      description: 'Export all pest sightings and disease reports with severity levels',
      endpoint: 'pestDisease',
      icon: <FileSpreadsheet className="h-5 w-5" />
    }
  ];

  const handleExport = async (item: ExportItem) => {
    setIsExporting({ ...isExporting, [item.id]: true })
    setError(null)
    
    try {
      const response = await exportApi[item.endpoint]()
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${item.id}-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      // Update last exported time in localStorage
      const exportHistory = JSON.parse(localStorage.getItem('exportHistory') || '{}')
      exportHistory[item.id] = new Date().toISOString()
      localStorage.setItem('exportHistory', JSON.stringify(exportHistory))
    } catch (err: any) {
      console.error(`Failed to export ${item.id}:`, err)
      if (err.response?.status === 403) {
        setError('You do not have permission to export data. Only administrators can access this feature.')
      } else {
        setError(`Failed to export ${item.title}. Please try again.`)
      }
    } finally {
      setIsExporting({ ...isExporting, [item.id]: false })
    }
  }

  const getLastExported = (itemId: string): string | null => {
    const exportHistory = JSON.parse(localStorage.getItem('exportHistory') || '{}')
    if (exportHistory[itemId]) {
      const date = new Date(exportHistory[itemId])
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return null
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Export</h1>
          <p className="text-muted-foreground">Download survey data in CSV format for analysis</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Export Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {exportItems.map((item) => {
            const lastExported = getLastExported(item.id);
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExport(item)}
                      disabled={isExporting[item.id]}
                    >
                      {isExporting[item.id] ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="ml-2">Export</span>
                    </Button>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                {lastExported && (
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last exported: {lastExported}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Export Guidelines</CardTitle>
            <CardDescription>Important information about data exports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <Database className="h-4 w-4 mt-0.5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium">Data Coverage</p>
                <p className="text-muted-foreground">Exports include all data from all routes and enumerators</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FileSpreadsheet className="h-4 w-4 mt-0.5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium">File Format</p>
                <p className="text-muted-foreground">CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" />
              <div className="text-sm">
                <p className="font-medium">Data Privacy</p>
                <p className="text-muted-foreground">Exported data may contain sensitive information. Handle with care and follow data protection guidelines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
