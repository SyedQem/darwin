'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const MAX_IMAGES = 4;

interface UploadedImage {
  file: File;
  preview: string;
  url: string | null;
  uploading: boolean;
}

interface ImageUploaderProps {
  onUrlsChange?: (urls: string[]) => void;
}

export default function ImageUploader({ onUrlsChange }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    onUrlsChange?.(
      images.filter((img) => img.url).map((img) => img.url as string)
    );
  }, [images, onUrlsChange]);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file);

      if (error) return null;

      const { data } = supabase.storage
        .from('listing-images')
        .getPublicUrl(path);

      return data.publicUrl;
    },
    [supabase]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const incoming = Array.from(files).slice(0, MAX_IMAGES - images.length);
      if (incoming.length === 0) return;

      const newImages: UploadedImage[] = incoming.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        url: null,
        uploading: true,
      }));

      setImages((prev) => [...prev, ...newImages]);

      for (let i = 0; i < newImages.length; i++) {
        const url = await uploadFile(newImages[i].file);
        setImages((prev) =>
          prev.map((img) =>
            img.preview === newImages[i].preview
              ? { ...img, url, uploading: false }
              : img
          )
        );
      }
    },
    [images.length, uploadFile]
  );

  const removeImage = (preview: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.preview === preview);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.preview !== preview);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`sell-upload-zone ${dragActive ? 'sell-upload-zone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <ImagePlus size={28} strokeWidth={1.5} />
        <p className="text-sm">
          {images.length >= MAX_IMAGES
            ? `Maximum ${MAX_IMAGES} photos`
            : 'Drag photos here or click to browse'}
        </p>
        <p className="text-xs text-muted">JPG, PNG, or WebP up to 5MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Previews */}
      {images.length > 0 && (
        <div className="sell-upload-previews">
          {images.map((img) => (
            <div key={img.preview} className="sell-upload-thumb">
              <Image
                src={img.preview}
                alt="Upload preview"
                fill
                sizes="80px"
                className="object-cover"
              />
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              )}
              <button
                type="button"
                className="sell-upload-thumb-remove"
                onClick={() => removeImage(img.preview)}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
