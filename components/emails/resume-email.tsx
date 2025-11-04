import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface ResumeEmailProps {
  name: string;
  isAttachment: boolean;
  resumeUrl: string;
}

export const ResumeEmail = ({
  name,
  isAttachment,
  resumeUrl,
}: ResumeEmailProps) => (
  <Html lang="en">
    <Head />
    <Body style={styles.body}>
      <Container style={styles.outer}>
        {/* Header */}
        <Section style={styles.header}>
          <h1 style={styles.h1}>Gourishankar Menavath</h1>
          <p style={styles.subtitle}>Frontend Developer</p>
        </Section>

        {/* Main Content */}
        <Section style={styles.content}>
          <Text style={styles.paragraph}>
            Hi <strong>{name}</strong>,
          </Text>
          <Text style={styles.paragraph}>
            I&apos;m always excited to connect with forward-thinking teams and explore new
            opportunities.{" "}
            {isAttachment ? (
              <>I&apos;ve attached my resume below</>
            ) : (
              <>you can download it directly from the link</>
            )}
            . Feel free to reach out if my experience aligns with what you&apos;re building!
          </Text>

          {isAttachment ? (
            <Section style={styles.attachmentSection}>
              <div style={styles.attachmentIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ verticalAlign: "middle" }}
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14 2 14 8 20 8"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Text style={styles.attachmentText}>
                📎 My resume is attached to this email.
              </Text>
            </Section>
          ) : (
            <Section style={styles.centerSection}>
              <Link href={resumeUrl} target="_blank" style={styles.downloadButton}>
                Download Resume
              </Link>
            </Section>
          )}

          <Text style={styles.paragraph}>
            You can also explore my work and recent projects on my portfolio:
          </Text>
          <Text style={styles.paragraph}>
            <Link
              href="https://your-portfolio-link.com"
              target="_blank"
              style={styles.portfolioLink}
            >
              🔗 Visit My Portfolio
            </Link>
          </Text>

          <Text style={styles.paragraph}>
            I’d love to hear from you — whether it’s about potential roles,
            collaborations, or just to connect.
          </Text>

          {/* Signature */}
          <Section style={styles.signature}>
            <Text style={styles.smallText}>Best regards,</Text>
            <Text style={styles.nameText}>Gourishankar Menavath</Text>
            <Text style={styles.roleText}>Frontend Developer</Text>
          </Section>

          {/* Contact Info */}
          <Section style={styles.contactBox}>
            <Text style={styles.contactText}>
              📧 m.gourishankarnaik@gmail.com &nbsp;|&nbsp; 📱 +91 949-351-8455
              &nbsp;|&nbsp;
              🔗{" "}
              <Link
                href="https://linkedin.com/in/i-gourish/"
                style={styles.linkedIn}
              >
                LinkedIn
              </Link>
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            This email was sent because you requested to download my resume.<br />
            © 2025 Gourishankar Menavath. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ResumeEmail;

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "oklch(0.75 0.08 250)",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif",
  },
  outer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    width: "700px",
    maxWidth: "100%",
    margin: "40px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  header: {
    background:
      "linear-gradient(135deg, oklch(0.60 0.1 222.03) 0%, oklch(0.55 0.22 270) 100%)",
    textAlign: "center" as const,
    padding: "40px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  h1: {
    margin: 0,
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "8px 0 0 0",
    color: "rgba(255,255,255,0.9)",
    fontSize: "16px",
  },
  content: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
  },
  paragraph: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    lineHeight: 1.6,
    color: "#212529",
  },
  attachmentSection: {
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center" as const,
    margin: "24px 0",
  },
  attachmentIcon: {
    display: "inline-block",
    backgroundColor: "oklch(0.60 0.1 222.03)",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    lineHeight: "48px",
    textAlign: "center" as const,
  },
  attachmentText: {
    margin: "12px 0 0 0",
    fontSize: "15px",
    fontWeight: 500,
    color: "#495057",
  },
  centerSection: {
    textAlign: "center" as const,
    margin: "24px 0",
  },
  downloadButton: {
    display: "inline-block",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#ffffff",
    background:
      "linear-gradient(135deg, oklch(0.60 0.1 222.03) 0%, oklch(0.65 0.22 25) 100%)",
    borderRadius: "8px",
    textDecoration: "none",
  },
  portfolioLink: {
    color: "oklch(0.55 0.22 270)",
    fontWeight: 600,
    textDecoration: "none",
  },
  signature: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e9ecef",
  },
  smallText: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#212529",
  },
  nameText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "oklch(0.60 0.1 222.03)",
  },
  roleText: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#6c757d",
  },
  contactBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "oklch(0.75 0.08 250)",
    borderRadius: "6px",
  },
  contactText: {
    margin: 0,
    fontSize: "13px",
    color: "#212529",
    textAlign: "center" as const,
  },
  linkedIn: {
    color: "oklch(0.55 0.22 270)",
    textDecoration: "none",
  },
  footer: {
    backgroundColor: "oklch(0.75 0.08 250)",
    padding: "24px 40px",
    textAlign: "center" as const,
    borderTop: "1px solid #e9ecef",
    borderRadius: "0 0 12px 12px",
  },
  footerText: {
    margin: 0,
    fontSize: "13px",
    color: "#212529",
    lineHeight: 1.5,
  },
};
