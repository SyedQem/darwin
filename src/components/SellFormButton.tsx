'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export default function SellFormButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="pill-btn ui-icon-label w-full min-h-12 text-base"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Publishing&hellip;</span>
        </>
      ) : (
        <span>Publish Listing</span>
      )}
    </button>
  );
}
