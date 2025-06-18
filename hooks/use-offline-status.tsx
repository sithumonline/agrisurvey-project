'use client';

import { useState, useEffect } from 'react';
import offlineManager, { SyncStatus } from '@/services/offline-manager';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true); // Default to true for SSR
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Set initial online status
    setIsOnline(offlineManager.getIsOnline());

    // Update queue count
    const updateQueueCount = async () => {
      const count = await offlineManager.getQueueCount();
      setQueueCount(count);
    };

    // Listen for online/offline changes
    const handleStatusChange = (online: boolean) => {
      setIsOnline(online);
      updateQueueCount();
    };

    // Listen for sync status changes
    const handleSyncStatus = (status: SyncStatus) => {
      setSyncStatus(status);
      if (status.status === 'completed') {
        updateQueueCount();
        // Clear sync status after 3 seconds
        setTimeout(() => {
          setSyncStatus(null);
        }, 3000);
      }
    };

    offlineManager.addStatusListener(handleStatusChange);
    offlineManager.addSyncListener(handleSyncStatus);

    // Initial queue count
    updateQueueCount();

    // Cleanup
    return () => {
      offlineManager.removeStatusListener(handleStatusChange);
      offlineManager.removeSyncListener(handleSyncStatus);
    };
  }, []);

  const syncOfflineData = async () => {
    await offlineManager.syncQueue();
  };

  const clearQueue = async () => {
    await offlineManager.clearQueue();
    const count = await offlineManager.getQueueCount();
    setQueueCount(count);
  };

  return {
    isOnline,
    syncStatus,
    queueCount,
    syncOfflineData,
    clearQueue,
  };
} 