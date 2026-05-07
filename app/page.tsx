import Link from 'next/link'
import Button from '@/components/ui/Button'
import {
  MicrophoneIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <SparklesIcon className="h-10 w-10 text-blue-600 animate-float" />
                <div className="absolute inset-0 h-10 w-10 text-purple-600 animate-pulse opacity-50">
                  <SparklesIcon className="h-10 w-10" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Interview Analyzer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 AI-Powered Interview Practice
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Master Your Interview Skills with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              AI-Powered Analysis
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Practice mock interviews and receive instant, detailed feedback on your
            confidence, speaking pace, filler words, and emotional engagement.
            <span className="block mt-2 font-semibold text-blue-600">
              Improve your performance with data-driven insights.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all">
                <SparklesIcon className="h-6 w-6 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                Learn More →
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-12">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>100% Free to Start</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-xl">✓</span>
              <span>Instant Analysis</span>
            </div>
          </div>
        </div>

        {/* Demo Video/Image Placeholder */}
        <div className="mt-16 rounded-3xl shadow-2xl overflow-hidden border-8 border-white transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-gradient"></div>
            <div className="text-center z-10">
              <MicrophoneIcon className="h-32 w-32 text-blue-600 mx-auto mb-6 animate-float" />
              <p className="text-gray-700 text-2xl font-semibold">
                Interactive Interview Session Demo
              </p>
              <p className="text-gray-600 mt-2">Real-time analysis as you speak</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features to Boost Your Performance
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to ace your next interview
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MicrophoneIcon className="h-8 w-8" />}
              title="Real-Time Analysis"
              description="Get instant feedback as you speak with live transcription and analysis."
            />
            <FeatureCard
              icon={<ChartBarIcon className="h-8 w-8" />}
              title="Comprehensive Metrics"
              description="Track confidence, pace, filler words, nervousness, and engagement."
            />
            <FeatureCard
              icon={<SparklesIcon className="h-8 w-8" />}
              title="AI-Powered Insights"
              description="Advanced algorithms analyze your speech patterns and provide actionable feedback."
            />
            <FeatureCard
              icon={<ClockIcon className="h-8 w-8" />}
              title="Progress Tracking"
              description="Monitor your improvement over time with detailed history and analytics."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Account"
              description="Sign up for free and set up your profile in seconds."
            />
            <StepCard
              number="2"
              title="Start Interview"
              description="Begin a mock interview session with webcam and microphone."
            />
            <StepCard
              number="3"
              title="Get Insights"
              description="Receive detailed analysis and recommendations to improve."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals improving their interview skills
            with AI-powered analysis.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-primary-400" />
                <span className="text-lg font-bold text-white">
                  AI Interview Analyzer
                </span>
              </div>
              <p className="text-sm">
                Empowering professionals with AI-driven interview insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 AI Interview Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
