import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getServerTranslations } from "@/lib/i18n-server";

type NavbarProps = {
  isAuthenticated?: boolean;
};

export async function Navbar({ isAuthenticated }: NavbarProps) {
  const { t } = await getServerTranslations();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-270 items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={118}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-medium text-text-dark md:flex">
          <Link href="/dashboard" className="hover:text-text-primary">
            {t("nav.dashboard")}
          </Link>
          <Link href="/find-jobs" className="hover:text-text-primary">
            {t("nav.findJobs")}
          </Link>
          <Link href="/profile" className="hover:text-text-primary">
            {t("nav.profile")}
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-9 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:px-5"
              >
                {t("nav.logout")}
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="min-h-9 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:px-5"
            >
              {t("nav.startFree")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
