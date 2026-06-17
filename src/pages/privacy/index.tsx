import AppLayout from "@/components/layout/AppLayout";
import React from "react";

const PrivacyPage = () => {
  return (
    <AppLayout title="Privacy Policy — Vault" contentVariant="centered">
      <article className="glossy_container static-page">
        <h1>Privacy Policy</h1>
        <p>
          Vault is built with security at its core. Your passwords are encrypted
          and stored securely. We never sell your personal data.
        </p>
        <h2>Data Collection</h2>
        <p>
          We collect only the information necessary to provide password
          management services: your email, account details, and encrypted
          credential data.
        </p>
        <h2>Data Security</h2>
        <p>
          All credentials are encrypted in transit and at rest. Access to your
          vault requires authentication via secure tokens.
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
