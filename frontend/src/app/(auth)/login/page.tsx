import { redirect } from "next/navigation";

// The canonical auth page is /auth - this redirect keeps old links working
export default function LoginPage() {
  redirect("/auth");
}
