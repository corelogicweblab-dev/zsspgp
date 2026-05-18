import { notFound } from "next/navigation";
import { DepartmentDashboard } from "@/components/admin/department-dashboard";
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

  return <DepartmentDashboard portal={portal} />;
}
