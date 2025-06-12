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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Leaf,
  Plus,
  Search,
  ArrowRight,
  Wheat,
  Coffee,
  Apple,
  MapPin,
  Route,
  Filter,
  SortAsc,
  MoreVertical,
  Edit,
} from "lucide-react";
import Link from "next/link";
import MainLayout from "@/components/layout/main-layout";
import { FarmForm } from "@/components/forms/farm-form";
import { farmsApi, routesApi } from "@/services/api";
import { getMediaUrl, formatCoordinates } from "@/lib/api-utils";

interface Farm {
  id: string;
  name: string;
  owner_name: string;
  size_ha: number | string;
  address?: string;
  location?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  photo?: string | null;
  route?: string;
  route_name?: string;
  crops?: Array<{ id: string; crop_type: string }>;
  updated_at?: string;
}

const cropIconMap: Record<string, any> = {
  Maize: Wheat,
  Beans: Leaf,
  Wheat: Wheat,
  Coffee: Coffee,
  Apples: Apple,
  Pears: Apple,
  Grapes: Leaf,
  Tomatoes: Leaf,
  Peppers: Leaf,
  Onions: Leaf,
};

export default function FarmsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [routes, setRoutes] = useState<any[]>([]);

  const fetchFarms = () => {
    setLoading(true);
    farmsApi
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setFarms(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load farms");
        setLoading(false);
      });
  };

  const fetchRoutes = () => {
    routesApi
      .getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setRoutes(data || []);
      })
      .catch((err) => {
        console.error("Failed to load routes:", err);
      });
  };

  useEffect(() => {
    fetchFarms();
    fetchRoutes();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...farms];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (farm) =>
          farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farm.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farm.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply route filter
    if (selectedRoute !== "all") {
      filtered = filtered.filter((farm) => farm.route === selectedRoute);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "owner":
          return a.owner_name.localeCompare(b.owner_name);
        case "size":
          return Number(b.size_ha) - Number(a.size_ha);
        case "created_at":
        default:
          return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      }
    });
    
    setFilteredFarms(filtered);
  }, [farms, searchQuery, selectedRoute, sortBy]);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingFarm(null);
    fetchFarms();
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setIsFormOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Farms</h1>
            <p className="text-muted-foreground">
              View and manage surveyed farms
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
            onClick={() => {
              setEditingFarm(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Farm
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search farms..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Last Updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading farms...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredFarms.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No farms found matching your criteria
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFarms.map((farm) => {
              // Pick a crop icon based on the first crop, fallback to Leaf
              const firstCrop = farm.crops?.[0]?.crop_type || "";
              const CropIcon = cropIconMap[firstCrop] || Leaf;
              return (
                <Card key={farm.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={`/farms/${farm.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 border-b">
                      <CardTitle className="text-md font-medium">
                        {farm.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {farm.crops && farm.crops.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {farm.crops.length} {farm.crops.length === 1 ? 'crop' : 'crops'}
                          </Badge>
                        )}
                        <CropIcon className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Owner:
                          </span>
                          <span className="text-sm font-medium">
                            {farm.owner_name}
                          </span>
                        </div>
                        {farm.route_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              <Route className="inline h-3 w-3 mr-1" />
                              Route:
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {farm.route_name}
                            </Badge>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Size:
                          </span>
                          <span className="text-sm font-medium">
                            {farm.size_ha} hectares
                          </span>
                        </div>
                        {farm.address && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-muted-foreground">
                              Address:
                            </span>
                            <span className="text-sm font-medium text-right max-w-[60%]">
                              {farm.address}
                            </span>
                          </div>
                        )}
                        {(farm.latitude !== null && farm.latitude !== undefined && 
                          farm.longitude !== null && farm.longitude !== undefined) && (
                          (() => {
                            const coords = formatCoordinates(farm.latitude, farm.longitude);
                            return coords ? (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  <MapPin className="inline h-3 w-3 mr-1" />
                                  GPS:
                                </span>
                                <span className="text-sm font-mono">{coords}</span>
                              </div>
                            ) : null;
                          })()
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Last visited:
                          </span>
                          <span className="text-sm font-medium">
                            {farm.updated_at
                              ? new Date(farm.updated_at).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                  
                  {/* Action menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditFarm(farm);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Farm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {farm.photo && (
                    <div className="mt-3 -mx-4 -mb-4">
                      <img
                        src={getMediaUrl(farm.photo)}
                        alt={`Photo of ${farm.name}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <FarmForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingFarm(null);
          }}
          onSuccess={handleFormSuccess}
          farmData={editingFarm}
        />
      </div>
    </MainLayout>
  );
}
