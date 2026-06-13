'use client';

import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Check, Loader2 } from 'lucide-react';
import { getCroppedImageBlob } from '@/lib/image-crop';

interface Props {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (file: File, previewUrl: string) => void;
  onCropError?: () => void;
}

export default function AvatarCropModal({
  imageSrc,
  open,
  onClose,
  onCropComplete,
  onCropError,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropAreaChange = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      onCropComplete(file, previewUrl);
      onClose();
    } catch {
      onCropError?.();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="profile-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="profile-crop-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Crop profile photo"
          >
            <div className="profile-crop-header">
              <h3>Crop Photo</h3>
              <button
                type="button"
                className="profile-modal-close"
                onClick={onClose}
                aria-label="Close crop dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="profile-crop-area">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropAreaChange}
              />
            </div>

            <div className="profile-crop-controls">
              <ZoomIn size={16} className="text-muted" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="profile-crop-zoom"
                aria-label="Zoom"
              />
            </div>

            <div className="profile-crop-actions">
              <button
                type="button"
                className="pill-btn pill-btn-outline pill-btn-sm"
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pill-btn pill-btn-sm"
                onClick={handleApply}
                disabled={processing || !croppedAreaPixels}
              >
                {processing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                <span>{processing ? 'Processing…' : 'Apply Crop'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
