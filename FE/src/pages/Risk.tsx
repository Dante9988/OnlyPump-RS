import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, DollarSign, Shield } from "lucide-react";
import Footer from "@/components/layout/Footer";

const Risk = () => {
  const riskCategories = [
    {
      icon: <TrendingDown className="h-6 w-6 text-destructive" />,
      title: "Market Risk",
      description: "Token prices are highly volatile and can lose value rapidly"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-destructive" />,
      title: "Total Loss Risk",
      description: "You may lose your entire investment amount"
    },
    {
      icon: <Shield className="h-6 w-6 text-destructive" />,
      title: "Platform Risk",
      description: "Third-party platform dependencies and technical risks"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h1 className="text-4xl font-extrabold text-destructive">Risk Disclosure</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Important information about the risks of participating in token presales
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="bg-destructive/10 border-destructive/40 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-destructive mb-2">⚠️ High Risk Investment Warning</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Token investments are extremely high-risk and speculative. You could lose all of your investment. 
                  Only invest money you can afford to lose completely. This is not financial advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {riskCategories.map((category, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-destructive/20 text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">{category.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-destructive">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              OnlyPump.me Risk Disclosure Statement
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: September 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Investment Risk Warning</h2>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <p className="text-destructive font-semibold">
                  ⚠️ TOKENS ARE EXTREMELY HIGH-RISK INVESTMENTS. YOU MAY LOSE YOUR ENTIRE INVESTMENT.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Participating in token presales involves substantial risk of financial loss. Token values can fluctuate 
                dramatically and may become worthless. There are no guarantees of profit or returns on your investment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Market Volatility</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Token prices can change rapidly and unpredictably</p>
                <p>• Markets may have low liquidity, making it difficult to sell</p>
                <p>• Price manipulation and pump-and-dump schemes may occur</p>
                <p>• External market conditions can significantly impact token values</p>
                <p>• Creator activity and community sentiment directly affect token prices</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Platform and Technical Risks</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Dependence on third-party platforms (Pump.fun) for token trading</p>
                <p>• Smart contract vulnerabilities and coding errors</p>
                <p>• Blockchain network congestion and high transaction fees</p>
                <p>• Potential platform downtime or technical failures</p>
                <p>• Regulatory changes affecting platform operations</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Creator-Specific Risks</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Creators may abandon projects or cease content creation</p>
                <p>• Quality and frequency of content may not meet expectations</p>
                <p>• Creator reputation and community management affects token value</p>
                <p>• No guarantee of exclusive content or promised benefits</p>
                <p>• Limited recourse if creators fail to deliver promised value</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Regulatory and Legal Risks</h2>
              <p className="text-muted-foreground leading-relaxed">
                Token regulations are evolving and uncertain. Future regulatory changes may affect token trading, 
                platform operations, or your ability to access your investments. Tokens may be classified as securities 
                in some jurisdictions, potentially affecting their legal status.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Liquidity Risk</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Limited or no secondary markets for tokens</p>
                <p>• Difficulty finding buyers when you want to sell</p>
                <p>• Wide bid-ask spreads resulting in unfavorable prices</p>
                <p>• Market manipulation affecting available liquidity</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. No Guarantees or Promises</h2>
              <div className="bg-muted/20 rounded-lg p-4 border border-border/40">
                <p className="text-muted-foreground">
                  <strong>OnlyPump.me makes no guarantees regarding:</strong>
                </p>
                <div className="text-muted-foreground space-y-1 mt-2">
                  <p>• Token price performance or stability</p>
                  <p>• Creator content quality or delivery</p>
                  <p>• Platform uptime or functionality</p>
                  <p>• Investment returns or profitability</p>
                  <p>• Token utility or future use cases</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Financial Suitability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Token investments are only suitable for investors who:
              </p>
              <div className="text-muted-foreground space-y-2 mt-2">
                <p>• Can afford to lose their entire investment</p>
                <p>• Understand blockchain technology and token mechanics</p>
                <p>• Have experience with high-risk investments</p>
                <p>• Are not relying on potential returns for essential expenses</p>
                <p>• Have conducted their own research and due diligence</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. No Financial Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                OnlyPump.me does not provide financial, investment, or legal advice. All information is for educational 
                purposes only. Consult qualified professionals before making investment decisions. Past performance 
                does not indicate future results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Your Acknowledgment</h2>
              <div className="bg-muted/20 rounded-lg p-4 border border-border/40">
                <p className="text-muted-foreground">
                  By participating in presales, you acknowledge that you:
                </p>
                <div className="text-muted-foreground space-y-1 mt-2">
                  <p>• Have read and understood all risks described</p>
                  <p>• Can afford to lose your entire investment</p>
                  <p>• Are participating voluntarily and at your own risk</p>
                  <p>• Will not hold OnlyPump.me liable for any losses</p>
                  <p>• Understand this is not financial advice</p>
                </div>
              </div>
            </section>

            <div className="mt-8 p-6 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="text-destructive font-semibold mb-2">FINAL WARNING</p>
                  <p className="text-sm text-muted-foreground">
                    Tokens are extremely high-risk investments. Many tokens become worthless. Only invest money 
                    you can afford to lose completely. Seek professional financial advice before making any investment 
                    decisions. This risk disclosure does not cover all possible risks.
                  </p>
                </div>
              </div>
            </div>

            <section className="pt-4">
              <h2 className="text-xl font-bold text-foreground mb-3">Contact for Questions</h2>
              <div className="text-muted-foreground space-y-2">
                <p>If you have questions about these risks:</p>
                <p>• Telegram: <a href="https://t.me/DenManuGPT" className="text-primary hover:underline">@DenManuGPT</a></p>
                <p>• Twitter: <a href="https://x.com/denmanu1989" className="text-primary hover:underline">@denmanu1989</a></p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Risk;