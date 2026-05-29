import Link from 'next/link';
import Image from 'next/image';
import type { ConversationRow } from '@/app/messages/actions';

interface ConversationListItemProps {
  conversation: ConversationRow;
  isActive?: boolean;
}

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ConversationListItem({
  conversation,
  isActive = false,
}: ConversationListItemProps) {
  const displayName =
    conversation.other_party.first_name ||
    conversation.other_party.full_name?.split(' ')[0] ||
    'User';

  return (
    <Link href={`/messages/${conversation.id}`} className="block focus:outline-none">
      <div
        className={`conversation-item ${isActive ? 'conversation-item--active' : ''}`}
      >
        {/* Listing thumbnail */}
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            position: 'relative',
          }}
        >
          {conversation.listing_image_url ? (
            <Image
              src={conversation.listing_image_url}
              alt={conversation.listing_title}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>IMG</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center justify-between gap-2">
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {conversation.unread > 0 && (
                <span className="conversation-unread-dot" aria-label={`${conversation.unread} unread`} />
              )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {formatRelativeTime(conversation.last_message_at)}
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.72rem',
              color: 'var(--accent)',
              letterSpacing: '0.04em',
              marginTop: '0.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {conversation.listing_title}
          </p>

          {conversation.last_message && (
            <p
              style={{
                fontSize: '0.82rem',
                color: conversation.unread > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
                fontWeight: conversation.unread > 0 ? 500 : 400,
                marginTop: '0.2rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conversation.last_message}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
