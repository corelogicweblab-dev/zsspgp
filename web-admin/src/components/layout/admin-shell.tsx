import { PageHeader } from "./page-header";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminShell({ children, title, subtitle }: AdminShellProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </>
  );
}
