'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Toast from './Toast';

const ERROR_MESSAGES: Record<string, string> = {
  sold_out: 'That tier is sold out. Try the other tier.',
  invalid_tier: 'Something went wrong with that selection. Try again.',
  checkout_failed: 'Checkout could not be started. Please try again.',
};

export default function WhitelistFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      setMessage(ERROR_MESSAGES[error] ?? 'Something went wrong.');
      setVisible(true);
    }
  }, [error]);

  const handleClose = () => {
    setVisible(false);
    router.replace('/whitelist', { scroll: false });
  };

  return (
    <Toast
      message={message}
      type="error"
      visible={visible}
      onClose={handleClose}
    />
  );
}
