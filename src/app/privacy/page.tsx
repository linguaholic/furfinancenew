'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us when using Fur Finance:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, and authentication details</li>
                <li><strong>Pet Information:</strong> Pet names, types, breeds, birth dates, and photos</li>
                <li><strong>Financial Data:</strong> Expense amounts, categories, dates, and descriptions</li>
                <li><strong>Usage Data:</strong> How you interact with our application</li>
                <li><strong>Technical Data:</strong> Device information, IP addresses, and browser details</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide and maintain the Fur Finance service</li>
                <li>Process and store your pet expense data</li>
                <li>Generate reports and analytics for your financial tracking</li>
                <li>Send you important updates about the service</li>
                <li>Improve our application and user experience</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Data Storage and Security</h2>
              <p className="mb-4">
                Your data is stored securely using industry-standard encryption and security measures:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Data is encrypted in transit and at rest</li>
                <li>We use secure cloud infrastructure (Supabase)</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Backup and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate the application (hosting, analytics, etc.)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Object:</strong> Object to certain processing of your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our application</li>
                <li>Provide personalized content and features</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className="mb-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
              <p className="mb-4">
                Our application integrates with the following third-party services:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Vercel:</strong> Hosting and analytics</li>
                <li><strong>Google Fonts:</strong> Typography services</li>
              </ul>
              <p className="mb-4">
                These services have their own privacy policies, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as your account is active or as needed to provide services. When you delete your account, we will:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Delete your personal data within 30 days</li>
                <li>Retain certain information for legal compliance if required</li>
                <li>Maintain anonymized data for analytics and improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Fur Finance is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the &quot;Last updated&quot; date</li>
                <li>Sending you an email notification for significant changes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="text-happy-green font-medium">Email:</p>
                <p>privacy@furfinance.app</p>
                <p className="text-happy-green font-medium mt-4">Support:</p>
                <p>support@furfinance.app</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Legal Basis for Processing (EU Users)</h2>
              <p className="mb-4">
                If you are located in the European Union, our legal basis for processing your personal information includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Consent:</strong> When you explicitly agree to our processing</li>
                <li><strong>Contract:</strong> To provide the services you requested</li>
                <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 