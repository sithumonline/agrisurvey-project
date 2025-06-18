import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface OfflineDB extends DBSchema {
  'sync-queue': {
    key: string;
    value: {
      id: string;
      type: 'farm' | 'crop' | 'soil-sample' | 'water-sample' | 'pest-disease';
      action: 'create' | 'update' | 'delete';
      data: any;
      timestamp: number;
      retryCount: number;
      lastError?: string;
    };
  };
}

class OfflineManager {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private isOnline: boolean = true; // Default to true, will be updated in constructor
  private syncInProgress: boolean = false;
  private listeners: Array<(isOnline: boolean) => void> = [];
  private syncListeners: Array<(status: SyncStatus) => void> = [];

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.initializeDB();
      this.setupNetworkListeners();
    }
  }

  private async initializeDB() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    this.db = await openDB<OfflineDB>('agrisurvey-offline', 1, {
      upgrade(db: IDBPDatabase<OfflineDB>) {
        // Create sync queue store
        if (!db.objectStoreNames.contains('sync-queue')) {
          db.createObjectStore('sync-queue', { keyPath: 'id' });
        }
      },
    });
  }

  private setupNetworkListeners() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      // Remove auto sync - let user manually sync
      // this.syncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  // Add a listener for online/offline status changes
  public addStatusListener(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    // Immediately notify the new listener of current status
    listener(this.isOnline);
  }

  // Add a listener for sync status changes
  public addSyncListener(listener: (status: SyncStatus) => void) {
    this.syncListeners.push(listener);
  }

  // Remove listeners
  public removeStatusListener(listener: (isOnline: boolean) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public removeSyncListener(listener: (status: SyncStatus) => void) {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  private notifySyncListeners(status: SyncStatus) {
    this.syncListeners.forEach(listener => listener(status));
  }

  // Check if online
  public getIsOnline(): boolean {
    // In server environment, always return true
    if (typeof window === 'undefined') return true;
    return this.isOnline;
  }

  // Add item to sync queue
  public async addToQueue(type: string, action: string, data: any): Promise<void> {
    // Skip in server environment
    if (typeof window === 'undefined') return;
    
    if (!this.db) await this.initializeDB();
    
    // Convert FormData to serializable object
    let serializableData = data;
    if (data instanceof FormData) {
      serializableData = await this.formDataToObject(data);
    }
    
    const id = `${type}-${action}-${Date.now()}-${Math.random()}`;
    const queueItem = {
      id,
      type: type as any,
      action: action as any,
      data: serializableData,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await this.db!.add('sync-queue', queueItem);
    
    // Don't auto sync - let user manually sync when online
    // if (this.isOnline) {
    //   this.syncQueue();
    // }
  }

  // Convert FormData to plain object
  private async formDataToObject(formData: FormData): Promise<any> {
    const obj: any = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Convert File to base64
        const base64 = await this.fileToBase64(value);
        obj[key] = {
          _isFile: true,
          name: value.name,
          type: value.type,
          size: value.size,
          data: base64,
        };
      } else {
        obj[key] = value;
      }
    }
    
    obj._wasFormData = true; // Mark that this was originally FormData
    return obj;
  }

  // Convert File to base64 string
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix to save space
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert object back to FormData
  private objectToFormData(obj: any): FormData {
    const formData = new FormData();
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_wasFormData') continue; // Skip our marker
      
      if (typeof value === 'object' && value !== null && (value as any)._isFile) {
        // Convert base64 back to File
        const fileObj = value as any;
        const file = this.base64ToFile(fileObj.data, fileObj.name, fileObj.type);
        formData.append(key, file);
      } else {
        formData.append(key, value as string);
      }
    }
    
    return formData;
  }

  // Convert base64 string back to File
  private base64ToFile(base64: string, filename: string, mimeType: string): File {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }

  // Get all queued items
  public async getQueuedItems(): Promise<any[]> {
    // Return empty array in server environment
    if (typeof window === 'undefined') return [];
    
    if (!this.db) await this.initializeDB();
    return await this.db!.getAll('sync-queue');
  }

  // Sync all queued items
  public async syncQueue(): Promise<void> {
    // Skip in server environment
    if (typeof window === 'undefined') return;
    
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    this.notifySyncListeners({ status: 'syncing', total: 0, completed: 0 });

    try {
      const items = await this.getQueuedItems();
      const total = items.length;
      let completed = 0;
      let failed = 0;

      for (const item of items) {
        try {
          await this.syncItem(item);
          await this.db!.delete('sync-queue', item.id);
          completed++;
          this.notifySyncListeners({ 
            status: 'syncing', 
            total, 
            completed,
            currentItem: item 
          });
        } catch (error: any) {
          failed++;
          // Update retry count and error
          item.retryCount++;
          item.lastError = error.message || 'Unknown error';
          await this.db!.put('sync-queue', item);
          
          // If too many retries, notify user
          if (item.retryCount >= 3) {
            this.notifySyncListeners({
              status: 'error',
              error: `Failed to sync ${item.type} after 3 attempts`,
              item
            });
          }
        }
      }

      this.notifySyncListeners({
        status: 'completed',
        total,
        completed,
        failed
      });
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync individual item
  private async syncItem(item: any): Promise<void> {
    const { type, action, data } = item;
    
    // Convert back to FormData if needed
    let syncData = data;
    if (data && data._wasFormData) {
      syncData = this.objectToFormData(data);
    }
    
    // Import API functions dynamically to avoid circular dependencies
    const api = await import('./api');
    
    switch (type) {
      case 'farm':
        if (action === 'create') {
          await api.farmsApi.create(syncData);
        } else if (action === 'update') {
          await api.farmsApi.update(data.id, syncData);
        } else if (action === 'delete') {
          await api.farmsApi.delete(data.id);
        }
        break;
        
      case 'crop':
        if (action === 'create') {
          await api.cropsApi.create(syncData);
        } else if (action === 'update') {
          await api.cropsApi.update(data.id, syncData);
        } else if (action === 'delete') {
          await api.cropsApi.delete(data.id);
        }
        break;
        
      case 'soil-sample':
        if (action === 'create') {
          await api.soilSamplesApi.create(syncData);
        } else if (action === 'update') {
          await api.soilSamplesApi.update(data.id, syncData);
        } else if (action === 'delete') {
          await api.soilSamplesApi.delete(data.id);
        }
        break;
        
      case 'water-sample':
        if (action === 'create') {
          await api.waterSamplesApi.create(syncData);
        } else if (action === 'update') {
          await api.waterSamplesApi.update(data.id, syncData);
        } else if (action === 'delete') {
          await api.waterSamplesApi.delete(data.id);
        }
        break;
        
      case 'pest-disease':
        if (action === 'create') {
          await api.pestDiseaseApi.create(syncData);
        } else if (action === 'update') {
          await api.pestDiseaseApi.update(data.id, syncData);
        } else if (action === 'delete') {
          await api.pestDiseaseApi.delete(data.id);
        }
        break;
        
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  // Clear all queued items
  public async clearQueue(): Promise<void> {
    // Skip in server environment
    if (typeof window === 'undefined') return;
    
    if (!this.db) await this.initializeDB();
    const items = await this.getQueuedItems();
    for (const item of items) {
      await this.db!.delete('sync-queue', item.id);
    }
  }

  // Get queue count
  public async getQueueCount(): Promise<number> {
    const items = await this.getQueuedItems();
    return items.length;
  }
}

// Types
export interface SyncStatus {
  status: 'syncing' | 'completed' | 'error';
  total?: number;
  completed?: number;
  failed?: number;
  error?: string;
  currentItem?: any;
  item?: any;
}

// Create singleton instance - safe for SSR
const offlineManager = new OfflineManager();
export default offlineManager; 