import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isTokenValid } from "@/utils/auth";

interface AppNavbarProps {
  showBack?: boolean;
  onBack?: () => void;
}

const navLinks = [
  { href: "/home", label: "Generator", auth: false },
  { href: "/profile/managepasswords", label: "Vault", auth: true },
  { href: "/profile/manageaccount", label: "Settings", auth: true },
  { href: "/profile", label: "Account", auth: true },
];

const AppNavbar: React.FC<AppNavbarProps> = ({ showBack, onBack }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isTokenValid());
  }, [router.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => router.pathname === href;

  const visibleLinks = navLinks.filter((link) => !link.auth || isLoggedIn);

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <div className="app-navbar__left">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-icon"
              aria-label="Go back"
            >
              <ArrowBackIcon style={{ fontSize: "20px" }} />
            </button>
          )}
          <Link href="/home" className="app-navbar__brand">
            <Image src="/vault.svg" alt="" width={28} height={28} aria-hidden />
            <span className="app-navbar__title">Vault</span>
          </Link>
        </div>

        <nav className="app-navbar__desktop" aria-label="Main navigation">
          <ul className="app-navbar__links">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`app-navbar__link ${
                    isActive(link.href) ? "app-navbar__link--active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-navbar__actions">
          {!isLoggedIn ? (
            <div className="app-navbar__auth">
              <Link href="/auth/login" className="btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary btn-sm">
                Register
              </Link>
            </div>
          ) : null}

          <button
            type="button"
            className="btn-icon app-navbar__menu-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <CloseIcon style={{ fontSize: "22px" }} />
            ) : (
              <MenuIcon style={{ fontSize: "22px" }} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="app-navbar__mobile">
          <nav aria-label="Mobile navigation">
            <ul className="app-navbar__mobile-links">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`app-navbar__mobile-link ${
                      isActive(link.href) ? "app-navbar__mobile-link--active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!isLoggedIn && (
                <>
                  <li>
                    <Link href="/auth/login" className="app-navbar__mobile-link">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="app-navbar__mobile-link app-navbar__mobile-link--primary"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
