'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

function isLocalPreview(src: string) {
  return src.startsWith('blob:') || src.startsWith('data:');
}

export default function ImageLightbox({ src, alt, open, onClose }: Props) {
  const localPreview = isLocalPreview(src);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="profile-modal-overlay profile-lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="profile-lightbox-close"
            onClick={onClose}
            aria-label="Close photo preview"
          >
            <X size={22} />
          </button>

          <motion.div
            className="profile-lightbox-content"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Profile photo preview"
          >
            {localPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="profile-lightbox-image" />
            ) : (
              <Image
                src={src}
                alt={alt}
                width={480}
                height={480}
                className="profile-lightbox-image"
                priority
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
