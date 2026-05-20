import { notFound } from "next/navigation";
import { DepartmentPortalDashboard } from "@/components/admin/department-portal-dashboard";
import { DrrmOpsDashboard } from "@/components/admin/drrm-ops-dashboard";
import { InformationOfficeDashboard } from "@/components/admin/information-office-dashboard";
import { findDepartmentPortalBySlug } from "@/lib/department-portals";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DepartmentSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const portal = findDepartmentPortalBySlug(slug);

  if (!portal) {
    notFound();
  }

  if (slug === "drrm") {
    return <DrrmOpsDashboard />;
  }

  if (slug === "information") {
    return <InformationOfficeDashboard />;
  }

  return <DepartmentPortalDashboard portal={portal} />;
}
