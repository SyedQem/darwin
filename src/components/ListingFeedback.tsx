'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Toast from '@/components/Toast';

export default function ListingFeedback() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  const published = searchParams.get('published');
  const updated = searchParams.get('updated');
  const error = searchParams.get('error');

  useEffect(() => {
    if (published === 'true') {
      setMessage('Listing published successfully.');
      setType('success');
      setVisible(true);
    } else if (updated === 'true') {
      setMessage('Listing updated successfully.');
      setType('success');
      setVisible(true);
    } else if (error) {
      setMessage(error);
      setType('error');
      setVisible(true);
    }
  }, [published, updated, error]);

  const handleClose = () => {
    setVisible(false);
    router.replace(pathname, { scroll: false });
  };

  return (
    <Toast
      message={message}
      type={type}
      visible={visible}
      onClose={handleClose}
    />
  );
}
