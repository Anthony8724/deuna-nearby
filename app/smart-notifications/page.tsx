import { redirect } from "next/navigation";

/** Misma entrada que `/` — pantalla bloqueada primero. */
export default function SmartNotificationsPage() {
  redirect("/");
}
