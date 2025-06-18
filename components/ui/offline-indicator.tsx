"use client";

import { useOfflineStatus } from '@/hooks/use-offline-status';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';

export function OfflineIndicator() {
  const { isOnline, syncStatus, queueCount, syncOfflineData, clearQueue } = useOfflineStatus();

  // Show indicator if offline or has queued items or sync status
  if (isOnline && queueCount === 0 && !syncStatus) {
    return null;
  }

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-4 w-4" />;
    }
    if (syncStatus?.status === 'syncing') {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    if (syncStatus?.status === 'error') {
      return <AlertCircle className="h-4 w-4" />;
    }
    if (queueCount > 0) {
      return <Upload className="h-4 w-4" />;
    }
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-500';
    if (syncStatus?.status === 'error') return 'bg-red-500';
    if (syncStatus?.status === 'syncing') return 'bg-blue-500';
    if (queueCount > 0) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus?.status === 'syncing') {
      const progress = syncStatus.total ? 
        Math.round((syncStatus.completed || 0) / syncStatus.total * 100) : 0;
      return `Syncing... ${progress}%`;
    }
    if (syncStatus?.status === 'error') return 'Sync Error';
    if (queueCount > 0) return `${queueCount} pending`;
    return 'Online';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${getStatusColor()} text-white border-0 hover:opacity-90`}
          >
            {getStatusIcon()}
            <span className="ml-2">{getStatusText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sync Status</h3>
              <Badge variant={isOnline ? 'default' : 'secondary'}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {!isOnline && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <WifiOff className="h-4 w-4" />
                <span>You're working offline. Changes will sync when connection is restored.</span>
              </div>
            )}

            {queueCount > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Updates</span>
                  <Badge variant="outline">{queueCount}</Badge>
                </div>
                
                {syncStatus?.status === 'syncing' && syncStatus.total && (
                  <div className="space-y-1">
                    <Progress 
                      value={(syncStatus.completed || 0) / syncStatus.total * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {syncStatus.completed} of {syncStatus.total} synced
                    </p>
                  </div>
                )}
              </div>
            )}

            {syncStatus?.status === 'error' && syncStatus.error && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-800">{syncStatus.error}</p>
                </div>
              </div>
            )}

            {syncStatus?.status === 'completed' && syncStatus.completed && (
              <div className="rounded-md bg-green-50 p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm text-green-800">
                    Successfully synced {syncStatus.completed} updates
                    {syncStatus.failed ? ` (${syncStatus.failed} failed)` : ''}
                  </p>
                </div>
              </div>
            )}

            {isOnline && queueCount > 0 && !syncStatus && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={syncOfflineData}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all pending updates?')) {
                      clearQueue();
                    }
                  }}
                >
                  Clear
                </Button>
              </div>
            )}

            {isOnline && queueCount > 0 && syncStatus?.status === 'syncing' && (
              <div className="text-sm text-muted-foreground text-center">
                Syncing in progress...
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 