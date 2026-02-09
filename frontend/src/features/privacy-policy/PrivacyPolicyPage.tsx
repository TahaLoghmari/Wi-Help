import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivacyPolicyPage() {
  return (
    <div className="bg-background flex h-screen flex-col">
      <div className="mb-6 px-4 pt-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="container mx-auto max-w-4xl flex-1 overflow-y-auto px-4 pb-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: January 29, 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to Wi-Help ("we," "our," or "us"). Wi-Help is a Tunisian
              home-care marketplace that connects patients with verified
              healthcare professionals for at-home services including nursing,
              physiotherapy, and caregiving. We are committed to protecting your
              privacy and handling your personal information with care and
              respect.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform, whether as a
              patient, healthcare professional, or visitor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              2. Information We Collect
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              2.1 Personal Information
            </h3>
            <p>When you register and use Wi-Help, we collect:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Account Information:</strong> Name, email address, phone
                number, password, date of birth, gender, and profile picture
              </li>
              <li>
                <strong>Address Information:</strong> Street address, city,
                state, postal code, and country
              </li>
              <li>
                <strong>Identity Verification:</strong> National ID,
                professional licenses, diplomas, and other verification
                documents
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              2.2 Health Information (Patients)
            </h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Medical history and chronic conditions</li>
              <li>Allergies and current medications</li>
              <li>Mobility status</li>
              <li>Emergency contact information</li>
              <li>Service requests and appointment details</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              2.3 Professional Information
            </h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Specializations and qualifications</li>
              <li>Education history (university, degrees, years)</li>
              <li>Professional experience and awards</li>
              <li>Licensing and insurance documentation</li>
              <li>Service offerings and pricing</li>
              <li>Availability schedules</li>
              <li>Bank account or Flouci wallet information for payments</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">2.4 Usage Data</h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Appointment bookings and service requests</li>
              <li>Messages and communications between users</li>
              <li>Ratings and reviews</li>
              <li>Payment and transaction information</li>
              <li>Device information and IP addresses</li>
              <li>Location data (when permission is granted)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Provide Services:</strong> Facilitate appointments,
                connect patients with professionals, process payments, and
                deliver healthcare services
              </li>
              <li>
                <strong>Verification:</strong> Verify the identity and
                credentials of healthcare professionals
              </li>
              <li>
                <strong>Communication:</strong> Send notifications about
                appointments, messages, payment confirmations, and platform
                updates
              </li>
              <li>
                <strong>Payment Processing:</strong> Handle authorization,
                capture, escrow, and disbursement of funds
              </li>
              <li>
                <strong>Quality Assurance:</strong> Monitor service quality,
                resolve disputes, and maintain safety standards
              </li>
              <li>
                <strong>Platform Improvement:</strong> Analyze usage patterns,
                improve features, and enhance user experience
              </li>
              <li>
                <strong>Legal Compliance:</strong> Comply with healthcare
                regulations and legal obligations in Tunisia
              </li>
              <li>
                <strong>Security:</strong> Detect and prevent fraud, abuse, and
                security incidents
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Information Sharing and Disclosure
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              4.1 With Healthcare Professionals
            </h3>
            <p>
              When you book an appointment, we share relevant patient
              information (name, address, medical information, contact details)
              with the assigned healthcare professional to enable them to
              provide appropriate care.
            </p>

            <h3 className="mb-3 text-xl font-semibold">4.2 With Patients</h3>
            <p>
              Patients can view professional profiles including name, photo,
              specializations, ratings, reviews, and service information.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              4.3 With Service Providers
            </h3>
            <p>
              We may share information with trusted third-party service
              providers who assist us:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Payment processors (Flouci and banking partners)</li>
              <li>Cloud hosting and data storage providers</li>
              <li>Communication services (SMS, email, push notifications)</li>
              <li>Analytics and monitoring tools</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              4.4 Legal Requirements
            </h3>
            <p>
              We may disclose information when required by law, legal process,
              or to:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Comply with healthcare regulations</li>
              <li>Respond to government requests</li>
              <li>Protect rights, property, or safety</li>
              <li>Investigate fraud or security issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              information:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>End-to-end encryption for sensitive communications</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and monitoring</li>
              <li>
                Access controls and authentication (including optional 2FA)
              </li>
              <li>Encrypted database storage</li>
              <li>Secure payment processing</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              provide our services and comply with legal obligations:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Active Accounts:</strong> Information is retained while
                your account is active
              </li>
              <li>
                <strong>Medical Records:</strong> Retained according to Tunisian
                healthcare regulations (typically 5-10 years)
              </li>
              <li>
                <strong>Financial Records:</strong> Retained for tax and
                accounting purposes as required by law
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Some information may be
                retained in backup systems for a limited period
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              7. Your Rights and Choices
            </h2>
            <p>
              You have the following rights regarding your personal information:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Access:</strong> Request a copy of your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information through your profile settings
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                associated data
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a structured,
                machine-readable format
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing
                communications (service-related messages may still be sent)
              </li>
              <li>
                <strong>Restrict Processing:</strong> Request limitations on how
                we process your data
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@wi-help.tn
              or through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              8. Cookies and Tracking
            </h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content</li>
            </ul>
            <p>
              You can control cookies through your browser settings, but
              disabling cookies may affect platform functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              9. Children's Privacy
            </h2>
            <p>
              Wi-Help is not intended for individuals under 18 years of age. We
              do not knowingly collect personal information from children. If
              you believe we have collected information from a minor, please
              contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              10. International Data Transfers
            </h2>
            <p>
              Your information is primarily stored and processed in Tunisia. If
              we transfer data internationally, we ensure appropriate safeguards
              are in place to protect your information in accordance with
              applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of material changes by posting the updated policy on our platform
              and updating the "Last Updated" date. Continued use of Wi-Help
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy,
              please contact us:
            </p>
            <div className="bg-muted mt-4 rounded-lg p-4">
              <p>
                <strong>Wi-Help Platform</strong>
              </p>
              <p>Email: privacy@wi-help.tn</p>
              <p>Support: support@wi-help.tn</p>
              <p>Address: Tunisia</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              13. Regulatory Compliance
            </h2>
            <p>
              Wi-Help complies with Tunisian healthcare regulations and data
              protection laws. We are committed to maintaining the
              confidentiality and security of patient health information in
              accordance with local medical privacy standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
