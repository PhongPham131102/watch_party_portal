import { useState, useRef } from 'react';
import * as tus from 'tus-js-client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle, AlertCircle, Pause, Play } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { episodeService } from '@/services/episode.service';
import { useUploadProgress } from '@/hooks';
import type { UploadEpisodeDto } from '@/types/episode.types';

interface TusUploadComponentProps {
  episodeMetadata: Omit<UploadEpisodeDto, 'filename' | 'filetype'>;
  onUploadComplete?: (episodeId: string, uploadId: string) => void;
  onUploadError?: (error: string) => void;
  onCancel?: () => void;
}

export function TusUploadComponent({
  episodeMetadata,
  onUploadComplete,
  onUploadError,
  onCancel,
}: TusUploadComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'paused' | 'completed' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [eta, setEta] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadId, setUploadId] = useState<string | null>(null);
  
  const uploadRef = useRef<tus.Upload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WebSocket for real-time progress (optional fallback)
  const { progress: wsProgress } = useUploadProgress({
    uploadId: uploadId || undefined,
    onProgress: (data) => {
      console.log('WebSocket progress:', data);
      setUploadProgress(data.percentage);
      setUploadSpeed(data.speed);
      setEta(data.estimatedTimeRemaining);
    },
    onCompleted: (data) => {
      console.log('WebSocket completed:', data);
      setUploadStatus('completed');
      if (data.episodeId && uploadId) {
        onUploadComplete?.(data.episodeId, uploadId);
      }
    },
    onFailed: (data) => {
      console.error('WebSocket failed:', data);
      setUploadStatus('error');
      setErrorMessage(data.error || 'Upload failed');
      onUploadError?.(data.error || 'Upload failed');
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type (video only)
      if (!selectedFile.type.startsWith('video/')) {
        showToast.error('Lỗi', 'Vui lòng chọn file video');
        return;
      }

      // Validate file size (max 10GB)
      const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
      if (selectedFile.size > maxSize) {
        showToast.error('Lỗi', 'File không được vượt quá 10GB');
        return;
      }

      setFile(selectedFile);
      setUploadStatus('idle');
      setUploadProgress(0);
      setErrorMessage('');
    }
  };

  const startUpload = () => {
    if (!file) {
      showToast.error('Lỗi', 'Vui lòng chọn file video');
      return;
    }

    // TUS Upload URL - chỉ cần root path
    // Backend có 2 routes:
    // - POST /api/v1/episodes/upload (tạo session)
    // - PATCH /api/v1/episodes/upload/:id (upload chunks)
    // TUS client tự động handle routing
    const tusUploadUrl = episodeService.getTusUploadUrl();
    console.log('🔗 TUS Upload URL:', tusUploadUrl);
    
    const accessToken = localStorage.getItem('accessToken');

    const metadata: Record<string, string> = {
      filename: file.name,
      filetype: file.type,
      movieId: episodeMetadata.movieId,
      episodeNumber: episodeMetadata.episodeNumber.toString(),
      title: episodeMetadata.title,
    };

    if (episodeMetadata.description) {
      metadata.description = episodeMetadata.description;
    }
    if (episodeMetadata.durationMinutes) {
      metadata.durationMinutes = episodeMetadata.durationMinutes.toString();
    }
    if (episodeMetadata.publishedAt) {
      metadata.publishedAt = episodeMetadata.publishedAt;
    }

    // Create TUS upload instance
    const upload = new tus.Upload(file, {
      endpoint: tusUploadUrl,
      retryDelays: [0, 1000, 3000, 5000], // Retry delays
      chunkSize: 5 * 1024 * 1024, // 5MB chunks
      metadata,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      onError: (error) => {
        console.error('Upload error:', error);
        setUploadStatus('error');
        setErrorMessage(error.message);
        showToast.error('Lỗi upload', error.message);
        onUploadError?.(error.message);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        setUploadProgress(percentage);

        // Calculate speed and ETA (simple calculation)
        const speed = `${(bytesUploaded / 1024 / 1024).toFixed(2)} MB`;
        const remaining = bytesTotal - bytesUploaded;
        const etaSeconds = Math.round(remaining / (bytesUploaded / 1));
        const etaMinutes = Math.floor(etaSeconds / 60);
        const etaFormatted = etaMinutes > 0 ? `${etaMinutes} phút` : `${etaSeconds} giây`;
        
        setUploadSpeed(speed);
        setEta(etaFormatted);
      },
      onSuccess: () => {
        console.log('Upload completed successfully');
        setUploadStatus('completed');
        setUploadProgress(100);
        showToast.success('Thành công', 'Upload video hoàn tất! Đang xử lý video...');
        
        // Get upload ID from URL
        const uploadUrl = upload.url;
        const uploadIdFromUrl = uploadUrl?.split('/').pop() || null;
        
        if (uploadIdFromUrl) {
          setUploadId(uploadIdFromUrl);
          // Note: episodeId will be available from WebSocket 'completed' event
        }
      },
      onAfterResponse: (req, res) => {
        // Get upload ID from response headers
        const location = res.getHeader('Location');
        if (location && !uploadId) {
          const uploadIdFromHeader = location.split('/').pop();
          setUploadId(uploadIdFromHeader || null);
        }
      },
    });

    uploadRef.current = upload;

    // Debug: Log upload config
    console.log('📦 TUS Upload Config:', {
      endpoint: tusUploadUrl,
      fileSize: file.size,
      chunkSize: 5 * 1024 * 1024,
      metadata,
    });

    // Start upload
    upload.start();
    setUploadStatus('uploading');
    showToast.info('Bắt đầu upload', 'Đang upload video...');
  };

  const pauseUpload = () => {
    if (uploadRef.current && uploadStatus === 'uploading') {
      uploadRef.current.abort();
      setUploadStatus('paused');
      showToast.info('Tạm dừng', 'Đã tạm dừng upload');
    }
  };

  const resumeUpload = () => {
    if (uploadRef.current && uploadStatus === 'paused') {
      uploadRef.current.start();
      setUploadStatus('uploading');
      showToast.info('Tiếp tục', 'Đang tiếp tục upload...');
    }
  };

  const cancelUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.abort(true); // true = delete upload on server
      setUploadStatus('idle');
      setUploadProgress(0);
      setFile(null);
      showToast.info('Đã hủy', 'Upload đã bị hủy');
      onCancel?.();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadSpeed('');
    setEta('');
    setErrorMessage('');
    setUploadId(null);
    uploadRef.current = null;
  };

  return (
    <div className="space-y-4">
      {/* File input */}
      {!file && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Chọn file video để upload (tối đa 10GB)
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2">
            Chọn file video
          </Button>
        </div>
      )}

      {/* File info and upload controls */}
      {file && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          {/* File info */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {uploadStatus === 'idle' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Progress bar */}
          {(uploadStatus === 'uploading' || uploadStatus === 'paused' || uploadStatus === 'completed') && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{uploadProgress}%</span>
                {uploadSpeed && <span>Speed: {uploadSpeed}</span>}
                {eta && <span>ETA: {eta}</span>}
              </div>
            </div>
          )}

          {/* Status messages */}
          {uploadStatus === 'completed' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Upload hoàn tất! Đang xử lý video...</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex gap-2">
            {uploadStatus === 'idle' && (
              <Button type="button" onClick={startUpload} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Bắt đầu upload
              </Button>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <Button type="button" variant="outline" onClick={pauseUpload} className="flex-1">
                  <Pause className="h-4 w-4 mr-2" />
                  Tạm dừng
                </Button>
                <Button type="button" variant="destructive" onClick={cancelUpload}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </>
            )}

            {uploadStatus === 'paused' && (
              <>
                <Button type="button" onClick={resumeUpload} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Tiếp tục
                </Button>
                <Button type="button" variant="destructive" onClick={cancelUpload}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <Button type="button" onClick={startUpload} className="flex-1">
                  Thử lại
                </Button>
                <Button type="button" variant="outline" onClick={resetUpload}>
                  Chọn file khác
                </Button>
              </>
            )}

            {uploadStatus === 'completed' && (
              <Button type="button" variant="outline" onClick={resetUpload} className="flex-1">
                Upload file khác
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

