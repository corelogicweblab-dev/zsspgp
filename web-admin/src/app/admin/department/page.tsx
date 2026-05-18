import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { DEPARTMENT_PORTALS } from "@/lib/department-portals";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Governor / ICT overview — lists all department portals. Staff are redirected to /admin/department/[slug] via middleware. */
export default function DepartmentOverviewPage() {
  return (
    <AdminShell
      title="Department Portals"
      subtitle="Provincial departments — each office signs in at /login with its designated email"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-500" />
            Provincial Departments
          </CardTitle>
          <CardDescription>
            Department officials use one login page with their office email and password, then land on
            their dashboard automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {DEPARTMENT_PORTALS.map((dept) => (
            <Link
              key={dept.code}
              href={`/admin/department/${dept.slug}`}
              className="flex gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-cyan-400/40 hover:shadow-md"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-50">
                <Image src={dept.imagePath} alt={dept.name} fill className="object-contain p-1.5" sizes="56px" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-cyan-700">{dept.code}</p>
                <p className="font-medium text-slate-900">{dept.name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{dept.email}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
