import offlineManager from './offline-manager';
import * as api from './api';

// Helper to generate temporary IDs for offline items
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Wrapper for API calls that handles offline mode
async function offlineWrapper<T>(
  type: string,
  action: string,
  onlineCall: () => Promise<T>,
  data?: any
): Promise<T> {
  if (offlineManager.getIsOnline()) {
    try {
      return await onlineCall();
    } catch (error) {
      // If network error, queue the operation
      if (isNetworkError(error)) {
        await offlineManager.addToQueue(type, action, data);
        // Return mock success response
        return createMockResponse(type, action, data) as T;
      }
      throw error;
    }
  } else {
    // Offline - queue the operation
    await offlineManager.addToQueue(type, action, data);
    // Return mock success response
    return createMockResponse(type, action, data) as T;
  }
}

// Check if error is network-related
function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network') ||
    error.message?.includes('Failed to fetch') ||
    !navigator.onLine
  );
}

// Create mock response for offline operations
function createMockResponse(type: string, action: string, data: any): any {
  if (action === 'create') {
    return {
      data: {
        ...data,
        id: generateTempId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _offline: true, // Mark as offline item
      },
    };
  } else if (action === 'update') {
    return {
      data: {
        ...data,
        updated_at: new Date().toISOString(),
        _offline: true,
      },
    };
  } else if (action === 'delete') {
    return { data: { success: true, _offline: true } };
  }
  return { data: {} };
}

// Offline-aware API implementations
export const offlineApi = {
  // Farms API
  farms: {
    create: (data: any) =>
      offlineWrapper(
        'farm',
        'create',
        () => api.farmsApi.create(data),
        data
      ),
    update: (id: string, data: any) =>
      offlineWrapper(
        'farm',
        'update',
        () => api.farmsApi.update(id, data),
        { ...data, id }
      ),
    delete: (id: string) =>
      offlineWrapper(
        'farm',
        'delete',
        () => api.farmsApi.delete(id),
        { id }
      ),
    // Read operations don't need offline handling
    getAll: api.farmsApi.getAll,
    getById: api.farmsApi.getById,
    getSamples: api.farmsApi.getSamples,
    getPestDisease: api.farmsApi.getPestDisease,
  },

  // Crops API
  crops: {
    create: (data: any) =>
      offlineWrapper(
        'crop',
        'create',
        () => api.cropsApi.create(data),
        data
      ),
    update: (id: string, data: any) =>
      offlineWrapper(
        'crop',
        'update',
        () => api.cropsApi.update(id, data),
        { ...data, id }
      ),
    delete: (id: string) =>
      offlineWrapper(
        'crop',
        'delete',
        () => api.cropsApi.delete(id),
        { id }
      ),
    getAll: api.cropsApi.getAll,
    getByFarm: api.cropsApi.getByFarm,
  },

  // Soil Samples API
  soilSamples: {
    create: (data: any) =>
      offlineWrapper(
        'soil-sample',
        'create',
        () => api.soilSamplesApi.create(data),
        data
      ),
    update: (id: string, data: any) =>
      offlineWrapper(
        'soil-sample',
        'update',
        () => api.soilSamplesApi.update(id, data),
        { ...data, id }
      ),
    delete: (id: string) =>
      offlineWrapper(
        'soil-sample',
        'delete',
        () => api.soilSamplesApi.delete(id),
        { id }
      ),
    getAll: api.soilSamplesApi.getAll,
    getById: api.soilSamplesApi.getById,
    getByFarm: api.soilSamplesApi.getByFarm,
  },

  // Water Samples API
  waterSamples: {
    create: (data: any) =>
      offlineWrapper(
        'water-sample',
        'create',
        () => api.waterSamplesApi.create(data),
        data
      ),
    update: (id: string, data: any) =>
      offlineWrapper(
        'water-sample',
        'update',
        () => api.waterSamplesApi.update(id, data),
        { ...data, id }
      ),
    delete: (id: string) =>
      offlineWrapper(
        'water-sample',
        'delete',
        () => api.waterSamplesApi.delete(id),
        { id }
      ),
    getAll: api.waterSamplesApi.getAll,
    getById: api.waterSamplesApi.getById,
    getByFarm: api.waterSamplesApi.getByFarm,
  },

  // Pest & Disease API
  pestDisease: {
    create: (data: any) =>
      offlineWrapper(
        'pest-disease',
        'create',
        () => api.pestDiseaseApi.create(data),
        data
      ),
    update: (id: string, data: any) =>
      offlineWrapper(
        'pest-disease',
        'update',
        () => api.pestDiseaseApi.update(id, data),
        { ...data, id }
      ),
    delete: (id: string) =>
      offlineWrapper(
        'pest-disease',
        'delete',
        () => api.pestDiseaseApi.delete(id),
        { id }
      ),
    getAll: api.pestDiseaseApi.getAll,
    getById: api.pestDiseaseApi.getById,
    getByFarm: api.pestDiseaseApi.getByFarm,
  },

  // Other APIs that don't need offline support
  auth: api.authApi,
  routes: api.routesApi,
  dashboard: api.dashboardApi,
  export: api.exportApi,
};

// Export the offline manager for direct access
export { offlineManager }; 