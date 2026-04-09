"use client";

import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Trophy,
  UtensilsCrossed,
  Lamp,
  Gamepad2,
  Ticket,
  Music,
  Smartphone,
  Bike,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { createAccountAndProfile } from "./actions";

/* ── Constants ── */

const TOTAL_STEPS = 5;

const INTERESTS = [
  { id: "textbooks", label: "Textbooks", icon: BookOpen },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "furniture", label: "Furniture", icon: Armchair },
  { id: "clothing", label: "Clothing", icon: Shirt },
  { id: "sports", label: "Sports & Outdoors", icon: Trophy },
  { id: "kitchen", label: "Kitchen & Dining", icon: UtensilsCrossed },
  { id: "dorm", label: "Dorm Essentials", icon: Lamp },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "tickets", label: "Tickets & Events", icon: Ticket },
  { id: "music", label: "Music & Instruments", icon: Music },
  { id: "phones", label: "Phones & Tablets", icon: Smartphone },
  { id: "transportation", label: "Transportation", icon: Bike },
];

const LEVELS_OF_STUDY = [
  "Undergraduate",
  "Graduate",
  "PhD",
  "Alumni",
  "Other",
];

const STEP_META = [
  { label: "Your Name", description: "Let\u2019s get to know you" },
  { label: "Your University", description: "Where do you study?" },
  {
    label: "Academic Profile",
    description: "Help us personalize your experience",
  },
  { label: "Your Interests", description: "What are you looking for?" },
  { label: "Create Account", description: "You\u2019re almost there" },
];

/* ── Framer Motion Variants ── */

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(6px)",
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

const itemVariants = {
  enter: { opacity: 0, y: 20, filter: "blur(4px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 400, damping: 28 },
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const containerChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/* ── Component ── */

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPending, startTransition] = useTransition();

  /* Profile state */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("");
  const [levelOfStudy, setLevelOfStudy] = useState("");
  const [program, setProgram] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  /* Account state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  /* ── Navigation ── */

  const goNext = useCallback(() => {
    if (step === 0 && !firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (step === 1 && !university) {
      setError("Please select your university");
      return;
    }
    setError("");
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [step, firstName, university]);

  const goBack = useCallback(() => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    startTransition(async () => {
      const result = await createAccountAndProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        university,
        levelOfStudy,
        program: program.trim(),
        interests,
        email: email.trim(),
        password,
      });
      if (result?.error) {
        setError(result.error);
      }
    });
  }, [
    firstName,
    lastName,
    university,
    levelOfStudy,
    program,
    interests,
    email,
    password,
  ]);

  /* ── Render ── */

  return (
    <div className="onboarding-shell">
      {/* ── Background Effects ── */}
      <div className="auth-shell__backdrop" aria-hidden="true">
        <span className="auth-shell__orb" />
        <span className="auth-shell__grid" />
      </div>

      {/* ── Main Container ── */}
      <motion.div
        className="onboarding-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Progress Header ── */}
        <motion.div
          className="onboarding-header"
          variants={containerChildVariants}
        >
          <div className="onboarding-progress-track">
            <motion.div
              className="onboarding-progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
          </div>
          <p className="onboarding-step-count">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </motion.div>

        {/* ── Wizard Panel ── */}
        <motion.div
          className="onboarding-panel-wrap"
          variants={containerChildVariants}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              className="onboarding-panel"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Step Header */}
              <motion.div
                className="onboarding-step-header"
                variants={itemVariants}
              >
                <p className="section-label">{STEP_META[step].label}</p>
                <h1 className="onboarding-title">
                  {STEP_META[step].description}
                </h1>
              </motion.div>

              {/* ════════ Step 0 — Name ════════ */}
              {step === 0 && (
                <>
                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="ob-first-name"
                      className="onboarding-label"
                    >
                      First name{" "}
                      <span className="onboarding-required">*</span>
                    </label>
                    <input
                      id="ob-first-name"
                      type="text"
                      className="vspr-input"
                      placeholder="e.g. Alex"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (error) setError("");
                      }}
                      autoFocus
                      autoComplete="given-name"
                    />
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="ob-last-name" className="onboarding-label">
                      Last name{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <input
                      id="ob-last-name"
                      type="text"
                      className="vspr-input"
                      placeholder="e.g. Rivera"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </motion.div>
                </>
              )}

              {/* ════════ Step 1 — University ════════ */}
              {step === 1 && (
                <motion.div
                  className="university-grid"
                  variants={itemVariants}
                >
                  {/* Carleton */}
                  <motion.button
                    type="button"
                    className={`university-card${university === "carleton" ? " university-card--selected" : ""}`}
                    onClick={() => {
                      setUniversity("carleton");
                      if (error) setError("");
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    data-accent="carleton"
                  >
                    <div className="university-card__icon">
                      <span className="university-card__initial">C</span>
                    </div>
                    <div className="university-card__info">
                      <h3 className="university-card__name">
                        Carleton University
                      </h3>
                      <p className="university-card__location">
                        Ottawa, Ontario
                      </p>
                    </div>
                    <AnimatePresence>
                      {university === "carleton" && (
                        <motion.div
                          className="university-card__check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* uOttawa */}
                  <motion.button
                    type="button"
                    className={`university-card${university === "uottawa" ? " university-card--selected" : ""}`}
                    onClick={() => {
                      setUniversity("uottawa");
                      if (error) setError("");
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    data-accent="uottawa"
                  >
                    <div className="university-card__icon">
                      <span className="university-card__initial">uO</span>
                    </div>
                    <div className="university-card__info">
                      <h3 className="university-card__name">
                        University of Ottawa
                      </h3>
                      <p className="university-card__location">
                        Ottawa, Ontario
                      </p>
                    </div>
                    <AnimatePresence>
                      {university === "uottawa" && (
                        <motion.div
                          className="university-card__check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}

              {/* ════════ Step 2 — Academic Profile ════════ */}
              {step === 2 && (
                <>
                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="ob-level" className="onboarding-label">
                      Level of study{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <select
                      id="ob-level"
                      className="vspr-select"
                      value={levelOfStudy}
                      onChange={(e) => setLevelOfStudy(e.target.value)}
                    >
                      <option value="">Select your level</option>
                      {LEVELS_OF_STUDY.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="ob-program" className="onboarding-label">
                      Program / Degree{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <input
                      id="ob-program"
                      type="text"
                      className="vspr-input"
                      placeholder="e.g. Computer Science"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                    />
                  </motion.div>
                </>
              )}

              {/* ════════ Step 3 — Interests ════════ */}
              {step === 3 && (
                <motion.div
                  className="interests-grid"
                  variants={itemVariants}
                >
                  {INTERESTS.map((interest, i) => {
                    const Icon = interest.icon;
                    const isSelected = interests.includes(interest.id);
                    return (
                      <motion.button
                        key={interest.id}
                        type="button"
                        className={`interest-chip${isSelected ? " interest-chip--selected" : ""}`}
                        onClick={() => toggleInterest(interest.id)}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          delay: i * 0.035,
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                        }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                      >
                        <Icon size={15} />
                        <span>{interest.label}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              className="interest-chip__check"
                              initial={{ scale: 0, width: 0 }}
                              animate={{ scale: 1, width: "auto" }}
                              exit={{ scale: 0, width: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 25,
                              }}
                            >
                              <Check size={12} strokeWidth={3} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {/* ════════ Step 4 — Account (Email & Password) ════════ */}
              {step === 4 && (
                <>
                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="ob-email" className="onboarding-label">
                      <Mail size={14} />
                      Email address{" "}
                      <span className="onboarding-required">*</span>
                    </label>
                    <input
                      id="ob-email"
                      type="email"
                      className="vspr-input"
                      placeholder="name@school.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      autoFocus
                      autoComplete="email"
                    />
                    <p className="auth-form-helper text-secondary">
                      Use your campus or personal email.
                    </p>
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="ob-password" className="onboarding-label">
                      Password{" "}
                      <span className="onboarding-required">*</span>
                    </label>
                    <div className="auth-password-wrap">
                      <input
                        id="ob-password"
                        type={showPassword ? "text" : "password"}
                        className="vspr-input auth-password-input"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="auth-password-toggle"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                    <p className="auth-form-helper text-muted">
                      At least 6 characters.
                    </p>
                  </motion.div>
                </>
              )}

              {/* ── Inline Error ── */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="onboarding-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Actions Bar ── */}
        <motion.div
          className="onboarding-actions"
          variants={containerChildVariants}
        >
          <div className="onboarding-actions__left">
            <AnimatePresence>
              {step > 0 && (
                <motion.button
                  type="button"
                  className="pill-btn pill-btn-outline pill-btn-sm"
                  onClick={goBack}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <ArrowLeft size={14} />
                  Back
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="onboarding-actions__right">
            {(step === 2 || step === 3) && (
              <motion.button
                type="button"
                className="onboarding-skip"
                onClick={goNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Skip
              </motion.button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <motion.button
                type="button"
                className="pill-btn"
                onClick={goNext}
                disabled={step === 1 && !university}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue
                <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                className="pill-btn"
                onClick={handleSubmit}
                disabled={isPending}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isPending ? "Creating account\u2026" : "Create Account"}
                <Sparkles size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
