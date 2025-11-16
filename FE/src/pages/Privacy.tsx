import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 gradient-text">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            How we collect, use, and protect your information
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle>OnlyPump.me Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: September 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
              <div className="text-muted-foreground space-y-3">
                <p><strong>Account Information:</strong> Email addresses, usernames, and profile information you provide</p>
                <p><strong>Wallet Data:</strong> Solana wallet addresses for token distribution and transaction processing</p>
                <p><strong>Transaction Data:</strong> Presale contributions, token allocations, and on-chain transaction records</p>
                <p><strong>Usage Analytics:</strong> Page views, feature usage, and platform interactions for service improvement</p>
                <p><strong>Creator Content:</strong> Posts, streams, and media uploaded by content creators</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Process presale contributions and token distributions</p>
                <p>• Facilitate creator-fan interactions and content access</p>
                <p>• Send transactional notifications about presales and allocations</p>
                <p>• Improve platform features and user experience</p>
                <p>• Ensure platform security and prevent fraud</p>
                <p>• Comply with legal obligations and regulatory requirements</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell personal information to third parties. Information may be shared with:
              </p>
              <div className="text-muted-foreground space-y-2 mt-2">
                <p>• <strong>Service Providers:</strong> Analytics, hosting, and payment processing services</p>
                <p>• <strong>Blockchain Networks:</strong> Wallet addresses and transaction data are publicly visible on Solana</p>
                <p>• <strong>Legal Authorities:</strong> When required by law or to protect our rights and users</p>
                <p>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures including encryption, secure data storage, 
                multisig wallet protection, and regular security audits. However, no system is completely secure, 
                and we cannot guarantee absolute protection against all threats.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Cookies and Tracking</h2>
              <div className="text-muted-foreground space-y-2">
                <p>We use cookies and similar technologies for:</p>
                <p>• Session management and user authentication</p>
                <p>• Analytics and performance monitoring</p>
                <p>• Preference storage and personalization</p>
                <p>• Security and fraud prevention</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform integrates with third-party services including Pump.fun for token transactions, 
                analytics providers, and hosting services. These services have their own privacy policies 
                governing data collection and use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
              <div className="text-muted-foreground space-y-2">
                <p>You have the right to:</p>
                <p>• Access and review your personal information</p>
                <p>• Request correction of inaccurate data</p>
                <p>• Delete your account and associated data</p>
                <p>• Export your data in a portable format</p>
                <p>• Opt out of non-essential communications</p>
                <p>• Object to processing for marketing purposes</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain personal information as long as necessary to provide services, comply with legal obligations, 
                and resolve disputes. Transaction records may be retained indefinitely for audit and compliance purposes. 
                Blockchain transactions are permanent and cannot be deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be processed and stored in countries other than your own. We ensure adequate 
                protection through appropriate safeguards including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for users under 18 years of age. We do not knowingly collect personal 
                information from children. If we become aware of such collection, we will delete the information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Policy Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                This privacy policy may be updated periodically to reflect changes in our practices or legal requirements. 
                We will notify users of material changes through email or platform notifications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. Contact Us</h2>
              <div className="text-muted-foreground space-y-2">
                <p>For privacy-related questions or requests:</p>
                <p>• Telegram: <a href="https://t.me/DenManuGPT" className="text-primary hover:underline">@DenManuGPT</a></p>
                <p>• Twitter: <a href="https://x.com/denmanu1989" className="text-primary hover:underline">@denmanu1989</a></p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground">
                By using OnlyPump.me, you consent to the collection and use of your information as described 
                in this Privacy Policy. We are committed to protecting your privacy and handling your data responsibly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;