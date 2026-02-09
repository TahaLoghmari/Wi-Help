import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TermsOfServicePage() {
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
          <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: January 29, 2026
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p>
              Welcome to Wi-Help. By accessing or using our platform, you agree
              to be bound by these Terms of Service ("Terms"). If you do not
              agree to these Terms, please do not use our services.
            </p>
            <p>
              Wi-Help is a healthcare marketplace platform that connects
              patients with verified healthcare professionals in Tunisia for
              at-home medical services including nursing, physiotherapy, and
              caregiving.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              2. Eligibility and Account Registration
            </h2>

            <h3 className="mb-3 text-xl font-semibold">2.1 Age Requirement</h3>
            <p>
              You must be at least 18 years old to create an account and use
              Wi-Help. By registering, you represent that you meet this age
              requirement.
            </p>

            <h3 className="mb-3 text-xl font-semibold">2.2 Account Creation</h3>
            <p>To use Wi-Help, you must:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Verify your email address or phone number via OTP</li>
              <li>Maintain the security of your password</li>
              <li>Promptly update your account information when necessary</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              2.3 Professional Verification
            </h3>
            <p>Healthcare professionals must submit and verify:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Valid professional diploma</li>
              <li>Current professional license/registration</li>
              <li>National ID</li>
              <li>Professional liability insurance</li>
            </ul>
            <p>
              Professionals will not be listed publicly until all documents are
              verified by our administration team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              3. Services and Platform Usage
            </h2>

            <h3 className="mb-3 text-xl font-semibold">3.1 For Patients</h3>
            <p>As a patient, you can:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Browse and select verified healthcare professionals</li>
              <li>
                View professional profiles, services, schedules, and pricing
              </li>
              <li>Book appointments for at-home healthcare services</li>
              <li>Communicate securely with assigned professionals</li>
              <li>Make payments through our secure payment system</li>
              <li>Rate and review services received</li>
              <li>Manage your medical information and history</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              3.2 For Healthcare Professionals
            </h3>
            <p>As a healthcare professional, you can:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Create a professional profile with specializations</li>
              <li>Set your service offerings and pricing</li>
              <li>Manage your availability and schedule</li>
              <li>Accept or reject appointment requests</li>
              <li>Communicate with patients</li>
              <li>Upload service reports and prescriptions</li>
              <li>Receive payments for completed services</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              3.3 Platform Limitations
            </h3>
            <p>Wi-Help is a marketplace platform. We:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Do not provide medical services directly</li>
              <li>Do not guarantee service outcomes or results</li>
              <li>Are not responsible for professional-patient interactions</li>
              <li>Do not replace emergency medical services</li>
            </ul>
            <p className="text-destructive font-semibold">
              ⚠️ IN CASE OF EMERGENCY, CALL LOCAL EMERGENCY SERVICES (e.g., 190
              in Tunisia). DO NOT USE WI-HELP FOR EMERGENCIES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Appointment and Payment Process
            </h2>

            <h3 className="mb-3 text-xl font-semibold">4.1 Booking Process</h3>
            <ol className="mb-4 list-decimal pl-6">
              <li>
                <strong>Discovery:</strong> Patient selects a professional and
                time slot
              </li>
              <li>
                <strong>Booking:</strong> Patient confirms booking and provides
                payment card details
              </li>
              <li>
                <strong>Authorization:</strong> System authorizes (but does not
                charge) the patient's card. Status: PENDING_APPROVAL
              </li>
              <li>
                <strong>Acceptance:</strong> Professional accepts or rejects the
                request
              </li>
              <li>
                <strong>Capture:</strong> Upon acceptance, payment is captured
                and held in escrow. Status: CONFIRMED
              </li>
            </ol>

            <h3 className="mb-3 text-xl font-semibold">
              4.2 Service Completion
            </h3>
            <ol className="mb-4 list-decimal pl-6">
              <li>
                <strong>Execution:</strong> Appointment takes place at scheduled
                time
              </li>
              <li>
                <strong>Completion:</strong> Professional marks appointment as
                finished and uploads required documentation
                (prescription/notes). Status: COMPLETED_PENDING_REVIEW
              </li>
              <li>
                <strong>Review Period:</strong> Patient has 48 hours to review
                and report any issues
              </li>
              <li>
                <strong>Settlement:</strong> After 48 hours without dispute,
                payment is released to the professional minus platform
                commission. Status: SETTLED
              </li>
            </ol>

            <h3 className="mb-3 text-xl font-semibold">
              4.3 Cancellation Policy
            </h3>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Before Professional Acceptance:</strong> Patient can
                cancel freely. Authorization is released. No charge.
              </li>
              <li>
                <strong>After Professional Acceptance:</strong> Cancellation may
                incur fees at the professional's discretion
              </li>
              <li>
                <strong>Professional Cancellation:</strong> If a professional
                cancels a confirmed appointment, the patient receives a full
                refund
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">4.4 Disputes</h3>
            <p>
              If you have an issue with a service (e.g., professional didn't
              show up, unsatisfactory service), you must report it within 48
              hours of service completion. Funds will be held in escrow pending
              administrative review. We will investigate and make a final
              decision on fund distribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">5. Payment Terms</h2>

            <h3 className="mb-3 text-xl font-semibold">5.1 Pricing</h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Professionals set their own service prices</li>
              <li>All prices displayed include applicable taxes</li>
              <li>
                Wi-Help charges a platform commission on each completed
                transaction
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">5.2 Payment Methods</h3>
            <p>
              Patients can pay via credit/debit cards. Payments are processed
              securely.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              5.3 Professional Payouts
            </h3>
            <p>Professionals receive payments via:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                <strong>Flouci Wallet:</strong> Automatic transfers after
                settlement
              </li>
              <li>
                <strong>Bank Transfer (RIB):</strong> Manual transfers processed
                by administration
              </li>
            </ul>
            <p>
              Professionals must configure their payout method before providing
              services.
            </p>

            <h3 className="mb-3 text-xl font-semibold">5.4 Refunds</h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Refunds are issued according to our cancellation policy</li>
              <li>Disputed transactions are reviewed case-by-case</li>
              <li>
                Refunds are processed to the original payment method within 5-10
                business days
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              6. User Conduct and Responsibilities
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              6.1 Prohibited Activities
            </h3>
            <p>You may NOT:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Provide false or misleading information</li>
              <li>Impersonate another person or entity</li>
              <li>Use the platform for fraudulent purposes</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Share inappropriate or offensive content</li>
              <li>Attempt to bypass verification processes</li>
              <li>Scrape or harvest data from the platform</li>
              <li>Interfere with platform operations or security</li>
              <li>Conduct transactions outside the platform to avoid fees</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              6.2 Professional Responsibilities
            </h3>
            <p>Healthcare professionals must:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Maintain valid licenses and insurance</li>
              <li>
                Provide services in accordance with professional standards
              </li>
              <li>Maintain patient confidentiality</li>
              <li>Arrive on time for scheduled appointments</li>
              <li>Upload required documentation after each service</li>
              <li>Comply with all applicable healthcare regulations</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              6.3 Patient Responsibilities
            </h3>
            <p>Patients must:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Provide accurate medical information</li>
              <li>Be present at the scheduled appointment time</li>
              <li>
                Provide a safe and appropriate environment for service delivery
              </li>
              <li>Treat professionals with respect</li>
              <li>Report issues truthfully and promptly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              7. Privacy and Data Protection
            </h2>
            <p>
              Your privacy is important to us. Our use of your personal
              information is governed by our{" "}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
            <p>
              By using Wi-Help, you consent to the collection and use of your
              information as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              8. Ratings and Reviews
            </h2>
            <ul className="mb-4 list-disc pl-6">
              <li>
                Patients can rate and review professionals after service
                completion
              </li>
              <li>
                Reviews must be honest, fair, and based on actual experience
              </li>
              <li>
                We reserve the right to remove reviews that violate our
                guidelines
              </li>
              <li>
                Reviews are publicly visible and contribute to professional
                scores
              </li>
              <li>
                Professionals cannot manipulate ratings or offer incentives for
                positive reviews
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              9. Intellectual Property
            </h2>
            <p>
              All content on Wi-Help, including text, graphics, logos, images,
              software, and design, is owned by Wi-Help or its licensors and is
              protected by intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>
                Copy, modify, or distribute platform content without permission
              </li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              10. Disclaimers and Limitations
            </h2>

            <h3 className="mb-3 text-xl font-semibold">10.1 No Warranty</h3>
            <p>
              Wi-Help is provided "AS IS" and "AS AVAILABLE" without warranties
              of any kind, either express or implied. We do not guarantee:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Uninterrupted or error-free service</li>
              <li>Specific medical outcomes or results</li>
              <li>
                Accuracy or reliability of professional-provided information
              </li>
              <li>Availability of professionals in your area</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold">
              10.2 Medical Disclaimer
            </h3>
            <p className="font-semibold">
              Wi-Help is a marketplace platform, not a healthcare provider. We
              do not provide medical advice, diagnosis, or treatment. Healthcare
              professionals on our platform are independent contractors, not
              employees of Wi-Help.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              10.3 Limitation of Liability
            </h3>
            <p>
              To the maximum extent permitted by law, Wi-Help and its
              affiliates, directors, employees, and agents shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages arising from your use of the platform, including:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Medical complications or adverse outcomes</li>
              <li>Professional negligence or malpractice</li>
              <li>Data breaches or security incidents</li>
              <li>Payment processing errors</li>
              <li>Loss of data or business</li>
            </ul>
            <p>
              Our total liability for any claim shall not exceed the amount you
              paid to Wi-Help in the 12 months prior to the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Wi-Help and its
              affiliates from any claims, damages, losses, liabilities, and
              expenses (including legal fees) arising from:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Your use of the platform</li>
              <li>Violation of these Terms</li>
              <li>Violation of any rights of another party</li>
              <li>Your provision or receipt of healthcare services</li>
              <li>Professional malpractice or negligence</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              12. Account Suspension and Termination
            </h2>

            <h3 className="mb-3 text-xl font-semibold">12.1 By You</h3>
            <p>
              You may close your account at any time through your account
              settings or by contacting support. You remain responsible for any
              outstanding obligations.
            </p>

            <h3 className="mb-3 text-xl font-semibold">12.2 By Us</h3>
            <p>We may suspend or terminate your account if you:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Violate these Terms or our policies</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Pose a risk to other users or the platform</li>
              <li>Fail to maintain required credentials (professionals)</li>
              <li>Receive excessive negative ratings or complaints</li>
            </ul>
            <p>
              We will provide notice when reasonably possible, but may act
              immediately if necessary.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              13. Dispute Resolution
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              13.1 Service Disputes
            </h3>
            <p>
              For disputes related to specific appointments or services, use our
              in-platform dispute resolution process within 48 hours of service
              completion. Our administration team will review evidence from both
              parties and make a final determination.
            </p>

            <h3 className="mb-3 text-xl font-semibold">13.2 Governing Law</h3>
            <p>
              These Terms are governed by the laws of Tunisia. Any disputes
              shall be resolved in accordance with Tunisian law and
              jurisdiction.
            </p>

            <h3 className="mb-3 text-xl font-semibold">13.3 Arbitration</h3>
            <p>
              For disputes not resolved through our internal process, parties
              agree to pursue mediation before litigation. If mediation fails,
              disputes may be resolved through Tunisian courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              14. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. When we
              make material changes, we will:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Post the updated Terms on our platform</li>
              <li>Update the "Last Updated" date</li>
              <li>Notify you via email or platform notification</li>
              <li>
                Provide at least 30 days' notice before changes take effect
              </li>
            </ul>
            <p>
              Continued use of Wi-Help after changes take effect constitutes
              acceptance of the updated Terms. If you do not agree to changes,
              you must stop using the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              15. General Provisions
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              15.1 Entire Agreement
            </h3>
            <p>
              These Terms, together with our Privacy Policy and any other
              policies referenced, constitute the entire agreement between you
              and Wi-Help.
            </p>

            <h3 className="mb-3 text-xl font-semibold">15.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions shall remain in full force
              and effect.
            </p>

            <h3 className="mb-3 text-xl font-semibold">15.3 Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms does
              not constitute a waiver of that right or provision.
            </p>

            <h3 className="mb-3 text-xl font-semibold">15.4 Assignment</h3>
            <p>
              You may not assign or transfer your rights under these Terms
              without our written consent. We may assign our rights without
              restriction.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              15.5 Third-Party Rights
            </h3>
            <p>These Terms do not create any third-party beneficiary rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              16. Contact Information
            </h2>
            <p>
              For questions about these Terms or to report violations, please
              contact us:
            </p>
            <div className="bg-muted mt-4 rounded-lg p-4">
              <p>
                <strong>Wi-Help Platform</strong>
              </p>
              <p>Email: legal@wi-help.tn</p>
              <p>Support: support@wi-help.tn</p>
              <p>Address: Tunisia</p>
            </div>
          </section>

          <div className="mt-8 border-t pt-8">
            <p className="text-muted-foreground text-sm">
              By using Wi-Help, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
