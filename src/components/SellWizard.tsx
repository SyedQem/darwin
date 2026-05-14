"use client";

import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { createListing } from "@/app/sell/actions";
import { categories } from "@/lib/data";
import ImageUploader from "@/components/ImageUploader";

/* ── Constants ── */

const TOTAL_STEPS = 3;

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

const STEP_META = [
  { label: "Photos", description: "Show off what you’re selling" },
  { label: "The Basics", description: "What is it, and how much?" },
  { label: "Details", description: "Add the finishing touches" },
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

export default function SellWizard({
  initialCampus = "",
}: {
  initialCampus?: string;
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPending, startTransition] = useTransition();

  /* Listing state */
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [campus, setCampus] = useState(initialCampus);
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const priceNum = Number(price);
  const basicsValid =
    title.trim().length > 0 &&
    price.trim().length > 0 &&
    Number.isFinite(priceNum) &&
    priceNum > 0;

  /* ── Navigation ── */

  const goNext = useCallback(() => {
    if (step === 1 && !basicsValid) {
      setError(
        !title.trim()
          ? "Add a title for your listing"
          : "Enter a price greater than $0",
      );
      return;
    }
    setError("");
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [step, basicsValid, title]);

  const goBack = useCallback(() => {
    setError("");
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!basicsValid) {
      setError(
        !title.trim()
          ? "Add a title for your listing"
          : "Enter a price greater than $0",
      );
      setDirection(-1);
      setStep(1);
      return;
    }

    startTransition(async () => {
      const result = await createListing({
        title: title.trim(),
        price: priceNum,
        imageUrls,
        condition,
        category,
        description: description.trim(),
        campus: campus.trim(),
      });
      if (result?.error) {
        setError(result.error);
      }
    });
  }, [
    basicsValid,
    title,
    priceNum,
    imageUrls,
    condition,
    category,
    description,
    campus,
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

              {/* ════════ Step 0 — Photos ════════ */}
              {step === 0 && (
                <motion.div
                  className="onboarding-field"
                  variants={itemVariants}
                >
                  <label className="onboarding-label">
                    Photos{" "}
                    <span className="onboarding-optional">optional</span>
                  </label>
                  <ImageUploader onUrlsChange={setImageUrls} />
                </motion.div>
              )}

              {/* ════════ Step 1 — Basics ════════ */}
              {step === 1 && (
                <>
                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="sw-title" className="onboarding-label">
                      Title <span className="onboarding-required">*</span>
                    </label>
                    <input
                      id="sw-title"
                      type="text"
                      className="vspr-input"
                      placeholder="e.g. Organic Chemistry Textbook (8th Ed)"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (error) setError("");
                      }}
                      autoFocus
                    />
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="sw-price" className="onboarding-label">
                      Price <span className="onboarding-required">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">
                        $
                      </span>
                      <input
                        id="sw-price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="vspr-input pl-8 font-mono"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (error) setError("");
                        }}
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* ════════ Step 2 — Details ════════ */}
              {step === 2 && (
                <>
                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="sw-condition"
                      className="onboarding-label"
                    >
                      Condition{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <select
                      id="sw-condition"
                      className="vspr-select"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="">Select condition</option>
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="sw-category"
                      className="onboarding-label"
                    >
                      Category{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <select
                      id="sw-category"
                      className="vspr-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label htmlFor="sw-campus" className="onboarding-label">
                      Campus{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <input
                      id="sw-campus"
                      type="text"
                      className="vspr-input"
                      placeholder="e.g. Main Campus"
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                    />
                  </motion.div>

                  <motion.div
                    className="onboarding-field"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="sw-description"
                      className="onboarding-label"
                    >
                      Description{" "}
                      <span className="onboarding-optional">optional</span>
                    </label>
                    <textarea
                      id="sw-description"
                      className="vspr-input resize-none"
                      rows={4}
                      placeholder="Describe the condition, what's included, and any details buyers should know..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
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
            {step === 0 && (
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
                disabled={step === 1 && !basicsValid}
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
                {isPending ? "Publishing…" : "Publish Listing"}
                {isPending ? (
                  <Check size={14} />
                ) : (
                  <Sparkles size={14} />
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
