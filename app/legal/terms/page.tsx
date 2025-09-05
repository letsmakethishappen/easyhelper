import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <p className="text-slate-600">Last updated: January 1, 2025</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using CarHelper.ai, you accept and agree to be bound by the terms and 
            provision of this agreement.
          </p>

          <h2>Description of Service</h2>
          <p>
            CarHelper.ai provides AI-powered automotive diagnostic assistance and repair guidance. 
            Our service is intended to supplement, not replace, professional mechanical expertise.
          </p>

          <h2>User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate information about your vehicle and symptoms</li>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Not attempt to reverse engineer or exploit our AI models</li>
            <li>Exercise proper safety precautions when working on vehicles</li>
          </ul>

          <h2>Limitations and Disclaimers</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
            <p className="font-medium text-yellow-900 mb-2">Important Safety Notice</p>
            <p className="text-yellow-800">
              CarHelper.ai provides informational guidance only. Vehicle work involves risk. 
              Always support vehicles safely and consult a qualified mechanic when in doubt. 
              Do not disable or modify safety or emissions equipment.
            </p>
          </div>

          <p>
            Our diagnostic suggestions are based on symptom patterns and should not be considered 
            definitive. Always verify diagnoses through proper testing before making repairs.
          </p>

          <h2>Subscription and Billing</h2>
          <ul>
            <li>Subscriptions automatically renew unless cancelled</li>
            <li>Refunds are available within 30 days of purchase</li>
            <li>We reserve the right to modify pricing with notice</li>
            <li>Failure to pay may result in service suspension</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            The CarHelper.ai service, including AI models, diagnostic algorithms, and content, 
            is proprietary and protected by intellectual property laws.
          </p>

          <h2>Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{' '}
            <Link href="/legal/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            to understand how we collect and use your information.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            CarHelper.ai shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of the service.
          </p>

          <h2>Contact Information</h2>
          <p>
            Questions about these Terms? Contact us at{' '}
            <a href="mailto:legal@carhelper.ai">legal@carhelper.ai</a>.
          </p>
        </div>
      </div>
    </div>
  );
}