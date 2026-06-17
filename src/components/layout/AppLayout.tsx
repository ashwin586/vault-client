import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import AppFooter from "./AppFooter";
import AppNavbar from "./AppNavbar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBack?: boolean;
  onBack?: () => void;
  contentVariant?: "centered" | "wide" | "full";
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  description = "Secure password generation and vault management",
  showBack = false,
  onBack,
  contentVariant = "centered",
  showFooter = true,
}) => {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="app-shell">
        <AppNavbar showBack={showBack} onBack={handleBack} />
        <main
          className={`app-main app-main--${contentVariant}`}
        >
          {children}
        </main>
        {showFooter && <AppFooter />}
      </div>
    </>
  );
};

export default AppLayout;
