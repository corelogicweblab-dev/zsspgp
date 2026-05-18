"use client";

import Link from "next/link";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { ProvincialNavDrawer } from "@/components/layout/provincial-nav-bar";
import { LogoutButton } from "@/components/auth/logout-button";

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

export function SideNav({ open, onClose }: SideNavProps) {
  return (
    <ProvincialNavDrawer
      open={open}
      onClose={onClose}
      header={
        <Link href="/" onClick={onClose} className="min-w-0">
          <ProvincialBrand href={undefined} logoSize={44} showText />
        </Link>
      }
      footer={<LogoutButton block onAfterSignOut={onClose} />}
    />
  );
}
