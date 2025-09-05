import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-slate-600">Last updated: January 1, 2025</p>

          <h2>Information We Collect</h2>
          <p>
            When you use CarHelper.ai, we collect information you provide directly, such as when you create an account, 
            add vehicle information, or interact with our diagnostic assistant.
          </p>

          <h3>Account Information</h3>
          <ul>
            <li>Name and email address</li>
            <li>Password (encrypted)</li>
            <li>Skill level and preferences</li>
          </ul>

          <h3>Vehicle Information</h3>
          <ul>
            <li>Year, make, model, and trim</li>
            <li>VIN (optional, encrypted)</li>
            <li>Mileage and maintenance records</li>
          </ul>

          <h3>Diagnostic Data</h3>
          <ul>
            <li>Symptoms and problems you describe</li>
            <li>OBD codes you provide</li>
            <li>Conversation history with our AI assistant</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our diagnostic services</li>
            <li>Personalize recommendations based on your skill level</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates</li>
            <li>Analyze usage patterns to improve our AI models</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share information in these limited circumstances:
          </p>
          <ul>
            <li>With service providers who help us operate the service</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transaction</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information against 
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your account information</li>
            <li>Export your diagnostic history</li>
            <li>Opt out of non-essential communications</li>
            <li>Request deletion of your account and associated data</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@carhelper.ai">privacy@carhelper.ai</a>.
          </p>
        </div>
      </div>
    </div>
  );
}