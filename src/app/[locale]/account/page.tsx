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
          <div className="w-16 h-16 rounded-none bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-[#3A3A3A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] tracking-tight mb-3">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </h1>
          <p className="text-[#3A3A3A] text-sm mb-8">
            {isAr
              ? "يمكنك تتبع طلباتك وإدارة حسابك بعد تسجيل الدخول."
              : "Sign in to track your orders and manage your account."}
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder={isAr ? "البريد الإلكتروني" : "Email address"}
              className="w-full border border-[#D4D4D4] rounded-none px-4 py-3 text-sm
                text-[#2C2C2C] placeholder:text-[#3A3A3A]/60 focus:outline-none focus:border-[#2C2C2C]"
            />
            <input
              type="password"
              placeholder={isAr ? "كلمة المرور" : "Password"}
              className="w-full border border-[#D4D4D4] rounded-none px-4 py-3 text-sm
                text-[#2C2C2C] placeholder:text-[#3A3A3A]/60 focus:outline-none focus:border-[#2C2C2C]"
            />
            <button
              className="w-full bg-[#2C2C2C] text-white py-3 text-sm font-semibold rounded-none
                hover:bg-[#3A3A3A] transition-colors"
            >
              {isAr ? "دخول" : "Sign In"}
            </button>
          </div>

          <p className="text-xs text-[#3A3A3A] mt-6">
            {isAr ? "ليس لديك حساب؟ " : "Don't have an account? "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-[#2C2C2C]">
              {isAr ? "سجّل الآن" : "Register"}
            </span>
          </p>
        </Reveal>
      </div>
    </PageWrapper>
  );
}
