import React, { useEffect } from 'react';
import socketHelper from '@/lib/socket';
import { useAppSelector } from '@/store/hooks';

interface SocketIOGuardProps {
  children: React.ReactNode;
}

/**
 * SocketIOGuard Component
 * 
 * Quản lý lifecycle của WebSocket connections:
 * - Connect khi component mount
 * - Disconnect khi component unmount
 * - Join user room khi có user đăng nhập
 * - Auto update token khi user login/logout
 */
export function SocketIOGuard({ children }: SocketIOGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    // Only connect if user is authenticated
    if (accessToken) {
      console.log('🔌 SocketIOGuard: Connecting to WebSocket...');
      
      // Update token
      socketHelper.setAccessToken(accessToken);
      
      // Connect main socket
      socketHelper.connect();

      // Join user room if user is logged in
      if (user?.id) {
        // Wait for connection then join room
        if (socketHelper.socket) {
          const handleConnect = () => {
            console.log('📡 SocketIOGuard: Joining user room:', user.id);
            socketHelper.joinRoom(user.id);
          };

          if (socketHelper.socket.connected) {
            handleConnect();
          } else {
            socketHelper.socket.once('connect', handleConnect);
          }
        }
      }
    } else {
      console.log('⚠️ SocketIOGuard: No access token, skipping WebSocket connection');
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 SocketIOGuard: Cleaning up WebSocket connection...');
      
      // Leave user room
      if (user?.id && socketHelper.isConnected()) {
        socketHelper.leaveRoom(user.id);
      }

      // Disconnect socket
      socketHelper.disconnect();
    };
  }, [user?.id]);

  // Auto-reconnect when token changes (login/logout)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && socketHelper.socket) {
      socketHelper.setAccessToken(accessToken);
    }
  }, [user]);

  return <>{children}</>;
}

export default SocketIOGuard;

