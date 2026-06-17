import AppLayout from "@/components/layout/AppLayout";
import EmailIcon from "@mui/icons-material/Email";
import React from "react";

const ContactPage = () => {
  return (
    <AppLayout title="Contact — Vault" contentVariant="centered">
      <article className="glossy_container static-page">
        <h1>Contact Us</h1>
        <p>
          Have questions about Vault or need help with your account? We&apos;re
          here to help.
        </p>
        <h2>Support</h2>
        <p>
          For technical support, security concerns, or account issues, reach out
          to our team.
        </p>
        <a
          href="mailto:ashwinv586@gmail.com"
          className="btn-ghost"
          style={{ display: "inline-flex", marginTop: "8px" }}
        >
          <EmailIcon style={{ fontSize: "18px" }} />
          ashwinv586@gmail.com
        </a>
      </article>
    </AppLayout>
  );
};

export default ContactPage;
