import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border bg-card p-10 shadow-lg shadow-primary/5">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Zeptai FocusAI Technology Private Limited is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you visit our website and interact with our services.
            </p>

            <div className="mt-10 space-y-10 text-base leading-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, including contact details, inquiry messages, and any information submitted through forms on the site. We may also collect usage data automatically when you visit our website, such as IP address, browser type, device information, and page interactions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">How We Use Information</h2>
                <p>
                  We use the information to communicate with you, respond to inquiries, improve our website experience, and provide information about our products and services. We may also use data for analytics, security monitoring, and to maintain our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Cookies and Analytics</h2>
                <p>
                  Our website may use cookies and similar technologies to improve performance, remember preferences, and analyze traffic. We rely on standard analytics tools to understand visitor behavior and improve our content and services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Services</h2>
                <p>
                  We may use trusted third-party service providers such as Firebase for hosting and form handling, and Razorpay for payment processing. These providers have their own privacy policies and are responsible for processing data only as necessary to deliver their services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Data Security</h2>
                <p>
                  We implement reasonable security measures to protect information from unauthorized access, use, or disclosure. However, no internet transmission or storage system is completely secure, so we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Your Rights</h2>
                <p>
                  You may contact us to update, correct, or delete your personal information. We will respond to such requests in accordance with applicable law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Changes to This Policy</h2>
                <p>
                  We may update this policy from time to time. When we do, we will revise the effective date and publish the updated policy on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
                <p>
                  If you have questions or concerns about this privacy policy, please contact us through the contact form on our website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
