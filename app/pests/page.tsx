"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  Plus,
  Search,
  ArrowRight,
  AlertTriangle,
  Camera,
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { PestReportForm } from "@/components/forms/pest-report-form";
import { pestDiseaseApi } from "@/services/api";

export default function PestsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = () => {
    setLoading(true);
    pestDiseaseApi
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setReports(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load pest & disease reports");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchReports();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Pests & Diseases
            </h1>
            <p className="text-muted-foreground">
              Track and report pest sightings and disease symptoms
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search reports..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading reports...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader
                  className={`flex flex-row items-center justify-between space-y-0 pb-2 border-b ${
                    report.severity === "high" ? "bg-red-50" : "bg-gray-50"
                  }`}
                >
                  <CardTitle className="text-md font-medium">
                    {report.name}
                    <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                      {report.category_display || report.category}
                    </Badge>
                  </CardTitle>
                  <Bug className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Farm:
                      </span>
                      <span className="text-sm font-medium">
                        {report.farm_name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Date:
                      </span>
                      <span className="text-sm font-medium">
                        {report.report_date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Severity:
                      </span>
                      {getSeverityBadge(report.severity)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Photo:
                      </span>
                      <span className="text-sm font-medium flex items-center">
                        {report.photo ? (
                          <>
                            <Camera className="mr-1 h-3 w-3 text-green-600" />
                            Available
                          </>
                        ) : (
                          "Not available"
                        )}
                      </span>
                    </div>
                    {/* <Link href={`/pests/${report.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pest Report Form Modal */}
        <PestReportForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
    </MainLayout>
  );
}
