"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bug,
  Plus,
  Search,
  AlertTriangle,
  Camera,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { PestReportForm } from "@/components/forms/pest-report-form";
import { pestDiseaseApi } from "@/services/api";
import { getMediaUrl } from "@/lib/api-utils";

export default function PestsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const fetchReports = () => {
    setLoading(true);
    pestDiseaseApi
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setReports(data || []);
        setFilteredReports(data || []);
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

  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((report) => report.category === categoryFilter);
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((report) => report.severity === severityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.report_date).getTime() - new Date(a.report_date).getTime();
        case "severity":
          const severityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  }, [reports, searchTerm, categoryFilter, severityFilter, sortBy]);

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

  const getCategoryIcon = (category: string) => {
    return category === "pest" ? (
      <div className="p-2 bg-orange-100 rounded-full">
        <Bug className="h-5 w-5 text-orange-600" />
      </div>
    ) : (
      <div className="p-2 bg-purple-100 rounded-full">
        <AlertTriangle className="h-5 w-5 text-purple-600" />
      </div>
    );
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

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search reports..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pest">Pests</SelectItem>
                <SelectItem value="disease">Diseases</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10 text-muted-foreground">
            Loading reports...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && filteredReports.length === 0 && (
          <div className="text-center py-10">
            <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== "all" || severityFilter !== "all"
                ? "No reports match your filters"
                : "No pest or disease reports yet"}
            </p>
            {(!searchTerm && categoryFilter === "all" && severityFilter === "all") && (
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Report
              </Button>
            )}
          </div>
        )}

        {!loading && !error && filteredReports.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {report.photo && (
                  <div className="h-48 w-full bg-gray-100 relative">
                    <img
                      src={getMediaUrl(report.photo)}
                      alt={report.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon(report.category)}
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {report.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report.category_display || report.category}
                      </p>
                    </div>
                  </div>
                  {getSeverityBadge(report.severity)}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <Link 
                        href={`/farms/${report.farm}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {report.farm_name}
                      </Link>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(report.report_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {report.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  {!report.photo && (
                    <div className="flex items-center justify-center py-4 bg-gray-50 rounded text-gray-400">
                      <Camera className="h-6 w-6 mr-2" />
                      <span className="text-sm">No photo</span>
                    </div>
                  )}
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
