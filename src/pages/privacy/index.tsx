import AppLayout from "@/components/layout/AppLayout";
import React from "react";

const PrivacyPage = () => {
  return (
    <AppLayout title="Privacy Policy — Vault" contentVariant="centered">
      <article className="glossy_container static-page">
        <h1>Privacy Policy</h1>
        <p>
          Vault is built with security at its core. Your vault passwords are
          encrypted on your device with a key derived from your master password.
          The server never receives your vault key or plaintext vault secrets.
          We never sell your personal data.
        </p>
        <h2>Data Collection</h2>
        <p>
          We collect only the information necessary to provide password
          management services: your email, account details, and encrypted
          vault ciphertext.
        </p>
        <h2>Data Security</h2>
        <p>
          Vault secrets are encrypted in your browser before upload. Access to
          your vault requires your master password on your device plus a valid
          session token.
        </p>
        <h2>Your Rights</h2>
        <p>
          You may request deletion of your account and associated data at any
          time by contacting support.
        </p>
      </article>
    </AppLayout>
  );
};

export default PrivacyPage;
