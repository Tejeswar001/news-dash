import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Globe, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personalized
            <span className="text-yellow-600 block">News Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay informed with AI-powered news insights, interactive visualizations, and personalized content from
            around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 px-8 py-3 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for News Analysis</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform how you consume news with our advanced analytics and personalization features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Interactive Charts</CardTitle>
                <CardDescription>
                  Visualize news trends with pie charts, bar graphs, and timeline analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>AI Summaries</CardTitle>
                <CardDescription>
                  Get concise AI-powered summaries of articles using advanced language models.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Global Coverage</CardTitle>
                <CardDescription>
                  Access news from multiple regions and filter by country, topic, and date range.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Smart Filtering</CardTitle>
                <CardDescription>
                  Advanced search and filtering capabilities to find exactly what you need.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your News Experience?</h2>
          <p className="text-xl text-yellow-100 mb-8">
            Join thousands of users who stay informed with our intelligent news dashboard.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-50 px-8 py-3">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
