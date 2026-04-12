import { redirect } from "next/navigation";

export default async function InspirationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/projects`);
}
