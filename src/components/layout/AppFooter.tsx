import Image from "next/image";
import Link from "next/link";
import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

const APP_VERSION = "0.1.0";

const footerLinks = [
  { href: "/home", label: "Home" },
  { href: "/home", label: "Password Generator" },
  { href: "/profile/managepasswords", label: "Vault" },
  { href: "/profile/manageaccount", label: "Settings" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

const AppFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <div className="app-footer__logo">
            <Image src="/vault.svg" alt="" width={24} height={24} aria-hidden />
            <span className="app-footer__name">Vault</span>
          </div>
          <p className="app-footer__tagline">
            Secure password generation and encrypted vault management.
          </p>
        </div>

        <nav className="app-footer__nav" aria-label="Footer navigation">
          <ul className="app-footer__links">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="app-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-footer__social">
          <a
            href="mailto:ashwinv586@gmail.com"
            className="app-footer__social-link"
            aria-label="Email support"
          >
            <EmailIcon style={{ fontSize: "18px" }} />
          </a>
          <a
            href="https://github.com/ashwin586"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__social-link"
            aria-label="GitHub"
          >
            <GitHubIcon style={{ fontSize: "18px" }} />
          </a>
        </div>
      </div>

      <div className="app-footer__bottom">
        <p className="app-footer__copyright">
          &copy; {year} Vault. All rights reserved.
        </p>
        <p className="app-footer__version">v{APP_VERSION}</p>
      </div>
    </footer>
  );
};

export default AppFooter;
