"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuthSession } from "@/hooks/use-auth-session";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  /** Full width, for drawer footer */
  block?: boolean;
  /** Called after sign-out (e.g. close mobile menu) */
  onAfterSignOut?: () => void;
  className?: string;
}

export function LogoutButton({ block, onAfterSignOut, className }: LogoutButtonProps) {
  const router = useRouter();
  const { session, loading } = useAuthSession();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    onAfterSignOut?.();
    router.push("/");
    router.refresh();
  }

  if (loading || !session) return null;

  if (block) {
    return (
      <div className="border-t border-cyan-500/15 p-3">
        <Button
          type="button"
          variant="outline"
          className={cn("w-full border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10", className)}
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "shrink-0 border-cyan-500/35 text-cyan-100 hover:bg-cyan-500/10",
        className
      )}
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 sm:mr-1.5" />
      <span className="hidden sm:inline">Log out</span>
    </Button>
  );
}
