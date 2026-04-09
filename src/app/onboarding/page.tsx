import type { Metadata } from "next";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Create Your Account — Darwin",
  description:
    "Set up your campus marketplace profile to start buying and selling.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
