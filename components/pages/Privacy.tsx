import React from 'react';
import SimpleHeader from '../SimpleHeader';
import Footer from '../Footer';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-purple-500/30 selection:text-white flex flex-col">
      <SimpleHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: October 24, 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you subscribe to our newsletter, submit an event, or contact us. This may include your name, email address, and any other information you choose to provide.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To provide, maintain, and improve our services.</li>
                    <li>To send you technical notices, updates, security alerts, and support messages.</li>
                    <li>To communicate with you about products, services, offers, promotions, and events.</li>
                    <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">3. Cookies</h2>
                <p>
                    We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">4. Third-Party Links</h2>
                <p>
                    Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">5. Data Security</h2>
                <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <span className="text-purple-400">privacy@conferencenights.com</span>.
                </p>
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;