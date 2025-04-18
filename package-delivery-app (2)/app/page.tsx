import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapIcon, PackageIcon, PlaneIcon, ShieldCheckIcon, MessageSquareIcon, CreditCardIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Crowdshipping</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="font-medium">
              Home
            </Link>
            <Link href="/how-it-works" className="font-medium">
              How It Works
            </Link>
            <Link href="/pricing" className="font-medium">
              Pricing
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Send Packages Worldwide with Travelers</h1>
                <p className="text-lg mb-8 text-gray-600">
                  Connect with travelers heading to your destination and save on shipping costs. A smarter way to send
                  packages to hard-to-reach places.
                </p>
                <div className="flex gap-4">
                  <Link href="/register?type=sender">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      Send a Package
                    </Button>
                  </Link>
                  <Link href="/register?type=traveler">
                    <Button size="lg" variant="outline">
                      Become a Traveler
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-80 w-full rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                  <PackageIcon className="h-32 w-32 text-emerald-600 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MapIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Register Your Trip or Package</h3>
                <p className="text-gray-600">
                  Travelers register their routes and available space. Senders list packages they need delivered.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MessageSquareIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect and Negotiate</h3>
                <p className="text-gray-600">
                  Use our in-app chat to discuss details, arrange pickup, and agree on delivery terms.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <CreditCardIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  Pay through our secure platform. Funds are released to the traveler after successful delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Crowdshipping</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
                  <p className="text-gray-600">
                    Our verification and reputation system ensures safe transactions between users.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                  <p className="text-gray-600">
                    Integrated payment system protects both parties during the transaction.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <PlaneIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Global Network</h3>
                  <p className="text-gray-600">
                    Connect with travelers going to destinations worldwide, even hard-to-reach places.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <MessageSquareIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
                  <p className="text-gray-600">
                    In-app chat allows for seamless coordination between senders and travelers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-emerald-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users already saving on shipping costs and making extra money while traveling.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-600"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PackageIcon className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold">Crowdshipping</span>
              </div>
              <p className="text-gray-400">
                Connecting travelers and senders for efficient package delivery worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-400 hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="text-gray-400 hover:text-white">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Crowdshipping. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
