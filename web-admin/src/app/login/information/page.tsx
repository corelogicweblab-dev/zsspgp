import { redirect } from "next/navigation";

/** Information Office uses role-based registration and standard login. */
export default function InformationLoginRedirect() {
  redirect("/login");
}
