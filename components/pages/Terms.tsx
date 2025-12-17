import React from 'react';
import SimpleHeader from '../SimpleHeader';
import Footer from '../Footer';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-txt-main font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <SimpleHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-txt-dim mb-10">Last updated: October 24, 2025</p>

        <div className="space-y-8 text-txt-muted leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Conference Nights, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
                <p>
                    Conference Nights provides a directory of third-party events ("Side-Events") taking place around major conferences. We are an aggregator of information and do not organize most of the events listed, unless explicitly stated otherwise.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">3. Disclaimer of Accuracy</h2>
                <p>
                    While we strive to keep our information accurate and up-to-date, event details (time, location, capacity, entry requirements) are subject to change by the event organizers without notice. Conference Nights is not responsible for any cancelled events, denied entry, or changes in schedule. We recommend verifying details with the official event organizer.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">4. User Contributions</h2>
                <p>
                    Users may submit events to our directory. By submitting an event, you grant Conference Nights a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content in connection with the service. You represent that you have the right to submit such information.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">5. Limitation of Liability</h2>
                <p>
                    In no event shall Conference Nights, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-3">6. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;