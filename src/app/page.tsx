import { redirect } from "next/navigation";

// Root "/" redirects to default locale "/ar"
export default function RootPage() {
  redirect("/ar");
}
