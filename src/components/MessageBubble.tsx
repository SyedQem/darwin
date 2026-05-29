import type { MessageRow } from '@/app/messages/actions';

interface MessageBubbleProps {
  message: MessageRow;
  isMine: boolean;
  showDateSeparator?: boolean;
  separatorLabel?: string;
}

export default function MessageBubble({
  message,
  isMine,
  showDateSeparator,
  separatorLabel,
}: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isOptimistic = message.id.startsWith('optimistic-');

  return (
    <>
      {showDateSeparator && separatorLabel && (
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/8" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {separatorLabel}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>
      )}
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div
          className={isMine ? 'msg-bubble-mine' : 'msg-bubble-theirs'}
          style={{ opacity: isOptimistic ? 0.6 : 1 }}
        >
          <p style={{ fontSize: '0.93rem', lineHeight: '1.55', wordBreak: 'break-word' }}>
            {message.body}
          </p>
          <p
            className="mt-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.08em',
              color: isMine ? 'rgba(249,115,22,0.6)' : 'var(--text-muted)',
              textAlign: isMine ? 'right' : 'left',
            }}
          >
            {isOptimistic ? 'Sending…' : time}
          </p>
        </div>
      </div>
    </>
  );
}
