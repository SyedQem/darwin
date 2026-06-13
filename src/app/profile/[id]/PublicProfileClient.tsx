'use client';

import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  GraduationCap,
  MapPin,
  ShoppingBag,
  Edit2,
  Star,
  BookOpen,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import ListingCard from '@/components/ListingCard';
import { Listing } from '@/lib/data';

const ease = [0.16, 1, 0.3, 1] as const;
function stagger(i: number, base = 0.12) {
  return { duration: 0.55, delay: base + i * 0.06, ease };
}

type ProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  school: string;
  levelOfStudy: string;
  program: string;
  interests: string[];
  createdAt: string;
};

interface Props {
  profile: ProfileData;
  listings: Listing[];
  isOwnProfile: boolean;
}

export default function PublicProfileClient({ profile, listings, isOwnProfile }: Props) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const isSeller = listings.length > 0;
  const roleName = isSeller ? 'Seller' : 'Buyer';

  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        {/* Header */}
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-label">CAMPUS PROFILE</span>
          <h1 className="section-title-md max-w-3xl">
            {profile.fullName || `${profile.firstName} ${profile.lastName}`.trim() || 'Student'}
          </h1>
          <p className="page-hero-copy max-w-2xl">
            {isOwnProfile
              ? 'This is how your profile appears to other students.'
              : `View listings and profile details for this campus member.`}
          </p>
        </motion.div>

        <div className="profile-grid">
          {/* ═══ Left: Avatar + Identity ═══ */}
          <motion.aside
            className="profile-sidebar"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(0)}
          >
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrap">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt="Profile avatar"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <User size={40} className="text-muted" />
                )}
              </div>
            </div>

            <div className="profile-identity">
              <h2 className="profile-identity-name">
                {profile.fullName || profile.firstName || 'Student'}
              </h2>
              
              <span className={`profile-count-badge mt-1`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                {roleName}
              </span>

              {profile.school && (
                <p className="profile-identity-meta mt-3">
                  <GraduationCap size={14} />
                  <span>{profile.school}</span>
                </p>
              )}
              <p className="profile-identity-meta">
                <Calendar size={14} />
                <span>Member since {memberSince}</span>
              </p>
            </div>

            {/* Edit Profile Button (if own profile) */}
            {isOwnProfile && (
              <Link
                href="/profile"
                className="pill-btn ui-icon-label w-full mt-4"
              >
                <Edit2 size={15} />
                <span>Edit Profile</span>
              </Link>
            )}
          </motion.aside>

          {/* ═══ Right: Cards ═══ */}
          <div className="profile-main">
            {/* ── About / Bio Card ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(1)}
            >
              <div className="profile-card-header">
                <User size={18} />
                <h3>About</h3>
              </div>

              <div className="text-secondary text-[15px] leading-relaxed max-w-prose">
                {profile.bio ? (
                  profile.bio
                ) : (
                  <p className="text-muted italic">This student hasn&apos;t written a bio yet.</p>
                )}
              </div>
            </motion.section>

            {/* ── Study Details Card ── */}
            {(profile.levelOfStudy || profile.program || (profile.interests && profile.interests.length > 0)) && (
              <motion.section
                className="profile-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(2)}
              >
                <div className="profile-card-header">
                  <BookOpen size={18} />
                  <h3>Student Details</h3>
                </div>

                <div className="flex flex-col gap-4">
                  {profile.school && (
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="text-muted mt-0.5" />
                      <div>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">University</p>
                        <p className="text-secondary text-sm font-semibold mt-0.5">{profile.school}</p>
                      </div>
                    </div>
                  )}

                  {profile.levelOfStudy && (
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="text-muted mt-0.5" />
                      <div>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Level of Study</p>
                        <p className="text-secondary text-sm font-semibold mt-0.5">{profile.levelOfStudy}</p>
                      </div>
                    </div>
                  )}

                  {profile.program && (
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="text-muted mt-0.5" />
                      <div>
                        <p className="text-xs text-muted font-medium uppercase tracking-wider">Program of Study</p>
                        <p className="text-secondary text-sm font-semibold mt-0.5">{profile.program}</p>
                      </div>
                    </div>
                  )}

                  {profile.interests && profile.interests.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-xs text-muted font-medium uppercase tracking-wider">Interests</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.interests.map((interest) => (
                          <span
                            key={interest}
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'rgba(255, 255, 255, 0.02)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ── Active Listings Card ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(3)}
            >
              <div className="profile-card-header">
                <ShoppingBag size={18} />
                <h3>Active Listings</h3>
                <span className="profile-count-badge">{listings.length}</span>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                  {listings.map((listing, index) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      index={index}
                      variant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="profile-empty py-12">
                  <ShoppingBag size={32} className="text-muted" />
                  <p className="text-secondary mt-3">No active listings posted by this student.</p>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
