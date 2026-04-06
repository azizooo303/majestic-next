import { PageWrapper } from "@/components/common/page-wrapper";
import { Reveal } from "@/components/common/reveal";
import { User } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "حسابي — ماجستيك للأثاث" : "My Account — Majestic Furniture",
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <PageWrapper id="main-content" className="flex-1 bg-white">
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <Reveal>
          <div className="w-16 h-16 rounded-full bg-[#f2f2f2] flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-[#484848]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900] tracking-tight mb-3">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </h1>
          <p className="text-[#484848] text-sm mb-8">
            {isAr
              ? "يمكنك تتبع طلباتك وإدارة حسابك بعد تسجيل الدخول."
              : "Sign in to track your orders and manage your account."}
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder={isAr ? "البريد الإلكتروني" : "Email address"}
              className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 text-sm
                text-gray-900] placeholder:text-[#484848]/60 focus:outline-none focus:border-[#0c0c0c]"
            />
            <input
              type="password"
              placeholder={isAr ? "كلمة المرور" : "Password"}
              className="w-full border border-[rgba(0,0,0,0.21)] rounded-sm px-4 py-3 text-sm
                text-gray-900] placeholder:text-[#484848]/60 focus:outline-none focus:border-[#0c0c0c]"
            />
            <button
              className="w-full bg-white text-white py-3 text-sm font-semibold rounded-sm
                hover:bg-[#333] transition-colors"
            >
              {isAr ? "دخول" : "Sign In"}
            </button>
          </div>

          <p className="text-xs text-[#484848] mt-6">
            {isAr ? "ليس لديك حساب؟ " : "Don't have an account? "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-gray-900]">
              {isAr ? "سجّل الآن" : "Register"}
            </span>
          </p>
        </Reveal>
      </div>
    </PageWrapper>
  );
}
