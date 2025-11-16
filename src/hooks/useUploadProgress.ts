import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { UploadProgressData } from '@/types/episode.types';
import { API_BASE_URL } from '@/constants';

interface UseUploadProgressOptions {
  uploadId?: string;
  onProgress?: (data: UploadProgressData) => void;
  onCompleted?: (data: UploadProgressData) => void;
  onFailed?: (data: UploadProgressData & { error: string }) => void;
  onError?: (error: string) => void;
}

interface UseUploadProgressReturn {
  progress: UploadProgressData | null;
  isConnected: boolean;
  subscribe: (uploadId: string) => void;
  unsubscribe: (uploadId: string) => void;
  disconnect: () => void;
}

/**
 * Custom hook để kết nối WebSocket và track upload progress
 * 
 * @example
 * const { progress, isConnected, subscribe } = useUploadProgress({
 *   uploadId: 'abc-123',
 *   onProgress: (data) => console.log(`Progress: ${data.percentage}%`),
 *   onCompleted: (data) => console.log('Upload completed!'),
 * });
 */
export const useUploadProgress = (
  options: UseUploadProgressOptions = {}
): UseUploadProgressReturn => {
  const { uploadId, onProgress, onCompleted, onFailed, onError } = options;

  const [progress, setProgress] = useState<UploadProgressData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.warn('No access token found, WebSocket connection skipped');
      return;
    }

    // Create WebSocket connection
    const socket = io(`${API_BASE_URL}/upload-progress`, {
      transports: ['websocket', 'polling'],
      auth: {
        token: accessToken,
      },
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('👋 WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setIsConnected(false);
      onError?.('Không thể kết nối WebSocket');
    });

    // Progress events
    socket.on('progress', (data: UploadProgressData) => {
      console.log('📊 Progress update:', data);
      setProgress(data);
      onProgress?.(data);
    });

    socket.on('completed', (data: UploadProgressData) => {
      console.log('✅ Upload completed:', data);
      setProgress(data);
      onCompleted?.(data);
    });

    socket.on('failed', (data: UploadProgressData & { error: string }) => {
      console.error('❌ Upload failed:', data);
      setProgress(data);
      onFailed?.(data);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('❌ WebSocket error:', data);
      onError?.(data.message);
    });

    socket.on('subscribed', (data: { uploadId: string; user: { id: string; username: string } }) => {
      console.log('📡 Subscribed to upload:', data);
    });

    socket.on('unsubscribed', (data: { uploadId: string }) => {
      console.log('👋 Unsubscribed from upload:', data);
    });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // Only run once on mount

  // Subscribe to specific uploadId
  useEffect(() => {
    if (uploadId && isConnected && socketRef.current) {
      console.log('📡 Subscribing to uploadId:', uploadId);
      socketRef.current.emit('subscribe', { uploadId });

      return () => {
        if (socketRef.current) {
          console.log('👋 Unsubscribing from uploadId:', uploadId);
          socketRef.current.emit('unsubscribe', { uploadId });
        }
      };
    }
  }, [uploadId, isConnected]);

  // Subscribe function (manual)
  const subscribe = useCallback((uploadId: string) => {
    if (socketRef.current && isConnected) {
      console.log('📡 Subscribing to uploadId:', uploadId);
      socketRef.current.emit('subscribe', { uploadId });
    }
  }, [isConnected]);

  // Unsubscribe function (manual)
  const unsubscribe = useCallback((uploadId: string) => {
    if (socketRef.current && isConnected) {
      console.log('👋 Unsubscribing from uploadId:', uploadId);
      socketRef.current.emit('unsubscribe', { uploadId });
    }
  }, [isConnected]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Manually disconnecting WebSocket');
      socketRef.current.disconnect();
      setIsConnected(false);
    }
  }, []);

  // Get progress function (manual query)
  const getProgress = useCallback((uploadId: string) => {
    if (socketRef.current && isConnected) {
      console.log('📊 Requesting progress for uploadId:', uploadId);
      socketRef.current.emit('get-progress', { uploadId });
    }
  }, [isConnected]);

  return {
    progress,
    isConnected,
    subscribe,
    unsubscribe,
    disconnect,
  };
};

