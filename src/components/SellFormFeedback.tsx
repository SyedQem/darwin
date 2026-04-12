'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Toast from './Toast';

export default function SellFormFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      setMessage('Listing published successfully.');
      setType('success');
      setVisible(true);
    } else if (error) {
      setMessage(error);
      setType('error');
      setVisible(true);
    }
  }, [success, error]);

  const handleClose = () => {
    setVisible(false);
    // Clear the query param after toast dismissal
    router.replace('/sell', { scroll: false });
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
