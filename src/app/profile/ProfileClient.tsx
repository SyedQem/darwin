'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Lock,
  Bell,
  ShoppingBag,
  LogOut,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { updateProfile, updateAvatarUrl } from './actions';
import { createClient } from '@/lib/supabase/client';

const ease = [0.16, 1, 0.3, 1] as const;
function stagger(i: number, base = 0.12) {
  return { duration: 0.55, delay: base + i * 0.06, ease };
}

type UserData = {
  id: string;
  email: string;
  createdAt: string;
};

type ProfileData = {
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  school: string;
};

type ListingItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  campus: string;
  imageUrl: string;
  createdAt: string;
};

interface Props {
  user: UserData;
  profile: ProfileData;
  listings: ListingItem[];
}

export default function ProfileClient({ user, profile, listings }: Props) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFeedback = useCallback(() => {
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  /* ── Avatar file selection ── */
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select an image file.' });
      clearFeedback();
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'Image must be under 2MB.',
      });
      clearFeedback();
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Upload avatar to Supabase Storage ── */
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      const ext = avatarFile.name.split('.').pop() ?? 'jpg';
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setFeedback({ type: 'error', message: uploadError.message });
        clearFeedback();
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Bust cache by appending timestamp
      const finalUrl = `${publicUrl}?t=${Date.now()}`;

      const result = await updateAvatarUrl(finalUrl);
      if (result.error) {
        setFeedback({ type: 'error', message: result.error });
        clearFeedback();
        return;
      }

      setAvatarUrl(finalUrl);
      setAvatarPreview(null);
      setAvatarFile(null);
      setFeedback({ type: 'success', message: 'Avatar updated!' });
      clearFeedback();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to upload avatar.' });
      clearFeedback();
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ── Save profile info ── */
  const handleSaveProfile = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const result = await updateProfile({
        firstName,
        lastName,
        bio,
      });

      if (result.error) {
        setFeedback({ type: 'error', message: result.error });
      } else {
        setFeedback({ type: 'success', message: 'Profile saved successfully!' });
      }
      clearFeedback();
    } catch {
      setFeedback({ type: 'error', message: 'Something went wrong.' });
      clearFeedback();
    } finally {
      setSaving(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const displayAvatar = avatarPreview || avatarUrl;

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
          <span className="section-label">ACCOUNT</span>
          <h1 className="section-title-md max-w-3xl">Your profile.</h1>
          <p className="page-hero-copy max-w-2xl">
            Manage your account details, listings, and preferences.
          </p>
        </motion.div>

        {/* Feedback Toast */}
        {feedback && (
          <motion.div
            className={`profile-toast ${feedback.type === 'success' ? 'profile-toast--success' : 'profile-toast--error'}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            {feedback.type === 'success' ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}

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
                {displayAvatar ? (
                  <Image
                    src={displayAvatar}
                    alt="Profile avatar"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <User size={40} className="text-muted" />
                )}
                <button
                  className="profile-avatar-edit"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change avatar"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
              </div>

              {avatarPreview && (
                <button
                  className="pill-btn pill-btn-sm mt-3"
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{uploadingAvatar ? 'Uploading…' : 'Save Avatar'}</span>
                </button>
              )}
            </div>

            <div className="profile-identity">
              <h2 className="profile-identity-name">
                {profile.fullName || profile.firstName || 'Student'}
              </h2>
              {profile.school && (
                <p className="profile-identity-meta">
                  <GraduationCap size={14} />
                  <span>{profile.school}</span>
                </p>
              )}
              <p className="profile-identity-meta">
                <Calendar size={14} />
                <span>Member since {memberSince}</span>
              </p>
            </div>

            {/* Sign Out */}
            <form action="/signout" method="post" className="w-full mt-auto">
              <button
                type="submit"
                className="profile-signout-btn"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </form>
          </motion.aside>

          {/* ═══ Right: Cards ═══ */}
          <div className="profile-main">
            {/* ── Account Information Card ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(1)}
            >
              <div className="profile-card-header">
                <User size={18} />
                <h3>Account Information</h3>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label" htmlFor="profile-first-name">
                    First Name
                  </label>
                  <input
                    id="profile-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="vspr-input"
                    maxLength={50}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label" htmlFor="profile-last-name">
                    Last Name
                  </label>
                  <input
                    id="profile-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="vspr-input"
                    maxLength={50}
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="profile-field profile-field--full">
                  <label className="profile-label" htmlFor="profile-email">
                    Email
                  </label>
                  <div className="profile-readonly-field">
                    <Mail size={16} className="text-muted" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="profile-field profile-field--full">
                  <label className="profile-label" htmlFor="profile-bio">
                    Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="vspr-input profile-textarea"
                    maxLength={300}
                    rows={3}
                    placeholder="Tell other students a bit about yourself…"
                  />
                  <span className="profile-char-count">
                    {bio.length}/300
                  </span>
                </div>
              </div>

              <div className="profile-card-footer">
                <button
                  className="pill-btn ui-icon-label"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>{saving ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </motion.section>

            {/* ── Security Card (Placeholder) ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(2)}
            >
              <div className="profile-card-header">
                <Lock size={18} />
                <h3>Security</h3>
              </div>

              <div className="profile-placeholder-row">
                <div className="profile-placeholder-info">
                  <p className="profile-placeholder-title">Password</p>
                  <p className="text-muted text-sm">
                    Change your password to keep your account secure.
                  </p>
                </div>
                <button className="pill-btn pill-btn-outline pill-btn-sm" disabled>
                  Change Password
                </button>
              </div>
            </motion.section>

            {/* ── Notifications Card (Placeholder) ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(3)}
            >
              <div className="profile-card-header">
                <Bell size={18} />
                <h3>Notifications</h3>
              </div>

              <div className="profile-placeholder-row">
                <div className="profile-placeholder-info">
                  <p className="profile-placeholder-title">Email Notifications</p>
                  <p className="text-muted text-sm">
                    Receive updates about messages and listing activity.
                  </p>
                </div>
                <div className="profile-toggle profile-toggle--disabled">
                  <div className="profile-toggle-track">
                    <div className="profile-toggle-thumb" />
                  </div>
                </div>
              </div>

              <div className="profile-placeholder-row">
                <div className="profile-placeholder-info">
                  <p className="profile-placeholder-title">Price Drop Alerts</p>
                  <p className="text-muted text-sm">
                    Get notified when items in your saved list drop in price.
                  </p>
                </div>
                <div className="profile-toggle profile-toggle--disabled">
                  <div className="profile-toggle-track">
                    <div className="profile-toggle-thumb" />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ── My Postings Card ── */}
            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(4)}
            >
              <div className="profile-card-header">
                <ShoppingBag size={18} />
                <h3>My Listings</h3>
                <span className="profile-count-badge">{listings.length}</span>
              </div>

              {listings.length > 0 ? (
                <div className="profile-listings-grid">
                  {listings.map((item) => (
                    <Link
                      key={item.id}
                      href={`/listing/${item.id}`}
                      className="profile-listing-item"
                    >
                      <div className="profile-listing-thumb">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="profile-listing-info">
                        <p className="profile-listing-title">{item.title}</p>
                        <div className="profile-listing-meta">
                          <span className="price-tag text-sm">${item.price}</span>
                          {item.campus && (
                            <span className="profile-listing-campus">
                              <MapPin size={11} />
                              {item.campus}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="profile-empty">
                  <ShoppingBag size={32} className="text-muted" />
                  <p className="text-secondary mt-3">No listings yet.</p>
                  <Link href="/sell" className="pill-btn pill-btn-sm mt-4 inline-flex">
                    Create your first listing
                  </Link>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
