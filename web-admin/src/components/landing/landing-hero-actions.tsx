"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSupport } from "@/components/support/support-provider";

export function LandingHeroActions() {
  const { openSupport } = useSupport();

  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:gap-3 lg:justify-start">
      <Button
        variant="gov"
        size="default"
        className="sm:h-12 sm:px-8 sm:text-base"
        onClick={() => openSupport("welcome")}
      >
        Get Started
      </Button>
      <Link href="/register">
        <Button variant="outline" size="default" className="sm:h-12 sm:px-8 sm:text-base">
          Create Account
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="ghost" size="default" className="sm:h-12 sm:px-6 sm:text-base text-cyan-200/90">
          Official Login
        </Button>
      </Link>
    </div>
  );
}
