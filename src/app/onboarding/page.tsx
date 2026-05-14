import type { Metadata } from "next";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Create Your Account — Darwin",
  description:
    "Set up your campus marketplace profile to start buying and selling.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <OnboardingWizard next={next} />;
}
