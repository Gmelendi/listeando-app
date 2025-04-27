import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextareaPrompt } from "@/components/textarea-prompt"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-calm-radial opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-calm-glow blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-calm-glow blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16 my-2">
            <div className="flex items-center gap-16">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <span className="ml-2 text-navy-800 font-bold text-xl">Listeando</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Button variant="ghost" className="text-navy-700 hover:text-navy-900 hover:bg-sky-100">
                  Features
                </Button>
                <Button variant="ghost" className="text-navy-700 hover:text-navy-900 hover:bg-sky-100">
                  Use Cases
                </Button>
                <Button variant="ghost" className="text-navy-700 hover:text-navy-900 hover:bg-sky-100">
                  Pricing
                </Button>
                <Button variant="ghost" className="text-navy-700 hover:text-navy-900 hover:bg-sky-100">
                  FAQ
                </Button>
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl text-white">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-0 sm:pt-40">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center rounded-full px-4 py-1 mb-8 
            bg-sky-100 border border-sky-200 
            shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-teal-500 mr-2" />
            <span className="text-sm text-navy-700">AI-powered research assistant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 mb-6">
            From text to
            {/* <br /> */}
            <span className="text-teal-600"> curated lists.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-navy-700 mb-8">
            Listeando scans the web, gathers information from multiple sources, and uses AI to extract exactly what you
            need. Get expertly curated lists in seconds, not hours.
          </p>

          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white mb-16">
            Create Your First List
          </Button>
        </div>
      </div>

      {/* Text Area Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-24">
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-teal-400/10 blur-[50px]" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-lg">
            <TextareaPrompt />
          </div>
        </div>

        {/* Example Output */}
        <div className="relative mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-md">
          <h3 className="text-xl font-semibold text-navy-800 mb-4">
            Example: "10 vegan brunch spots in Lisbon with outdoor seating"
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="text-navy-800 font-medium">The Food Temple</h4>
                <p className="text-navy-600 text-sm">
                  Creative vegan cuisine in a cozy courtyard setting in Mouraria. Verified by 3 sources including local
                  food blogs.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="text-navy-800 font-medium">Ao 26 Vegan Food Project</h4>
                <p className="text-navy-600 text-sm">
                  Popular spot with creative brunch options and spacious terrace. Highly rated for their weekend brunch
                  menu.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="text-navy-800 font-medium">Vegan Nata</h4>
                <p className="text-navy-600 text-sm">
                  Specializing in vegan versions of Portugal's famous pastéis de nata with a charming garden patio area.
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                See full list →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 bg-gradient-to-b from-white to-sky-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 mb-12 text-center">How Listeando works</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-3">You describe what you need</h3>
              <p className="text-navy-700">
                Simply tell us what list you're looking for. Be as specific as you want about topics, criteria, or
                details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-3">Our AI scans multiple sources</h3>
              <p className="text-navy-700">
                Listeando searches across the web, gathering information from reliable sources, reviews, articles, and
                databases.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-3">Get your curated list</h3>
              <p className="text-navy-700">
                We compile the most relevant, accurate information into a beautifully formatted list, ready to use or
                export.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Use Cases Section */}
      <div className="relative py-24 bg-gradient-to-b from-white to-sky-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900 mb-4 text-center">
            Intelligent list creation
          </h2>
          <p className="text-lg text-navy-700 mb-12 max-w-2xl mx-auto text-center">
            Our AI scans multiple sources to find, verify, and compile the most relevant information for your specific
            needs.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Travel Research</h3>
              <p className="text-navy-700">
                "Hidden gems in Barcelona verified by locals", "Family-friendly Tokyo itinerary with accessibility
                info", "Budget hotels in Paris with high safety ratings"
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Content Research</h3>
              <p className="text-navy-700">
                "Evidence-based sleep improvement techniques", "Productivity methods with scientific backing", "Most
                discussed sci-fi books of 2023 across review platforms"
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Project Planning</h3>
              <p className="text-navy-700">
                "Comprehensive website launch checklist from multiple experts", "Home renovation steps with cost
                estimates", "Wedding planning timeline with vendor recommendations"
              </p>
            </div>

            {/* Use Case 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Food & Recipes</h3>
              <p className="text-navy-700">
                "Highly-rated vegan dinner recipes with pantry substitutions", "Meal prep ideas with nutrition
                information", "Best brunch spots in New York according to local food critics"
              </p>
            </div>

            {/* Use Case 5 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Learning Resources</h3>
              <p className="text-navy-700">
                "Python learning roadmap with curated tutorials", "Most recommended digital marketing courses across
                platforms", "Free and paid resources for beginners in UX design"
              </p>
            </div>

            {/* Use Case 6 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Financial Research</h3>
              <p className="text-navy-700">
                "Comprehensive budget categories with expert tips", "Research-backed grocery saving strategies",
                "Beginner investment options compared across multiple financial advisors"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User-Generated Lists Section */}
      {/* <SampleLists /> */}

      {/* Pricing Section */}
      <div className="relative mt-0 bg-gradient-to-b from-sky-50 to-white py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-navy-900 mb-4">Research made simple.</h2>
          <p className="text-lg text-navy-700 mb-12 max-w-2xl mx-auto">
            Get the information you need without the endless searching and tab switching.
          </p>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-teal-400/10 blur-xl group-hover:bg-teal-400/15 transition-colors duration-300" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-100 shadow-lg">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl font-semibold text-navy-800 mb-2">Pay Per List</h3>
                  <div className="text-5xl font-bold text-navy-900 mb-6">
                    $3.99<span className="text-lg font-normal text-navy-600">/list</span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center text-navy-700">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Information from multiple sources
                    </li>
                    <li className="flex items-center text-navy-700">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      AI-verified accuracy
                    </li>
                    <li className="flex items-center text-navy-700">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Export in multiple formats
                    </li>
                    <li className="flex items-center text-navy-700">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save hours of research time
                    </li>
                    <li className="flex items-center text-navy-700">
                      <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No subscription required
                    </li>
                  </ul>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Generate a List for $5</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-0 border-t border-sky-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-navy-800 font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-navy-800 font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-navy-800 font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-navy-800 font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-navy-600 hover:text-teal-600 transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-6 border-t border-sky-100 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="ml-2 text-navy-800 font-bold">Listeando</span>
            </div>
            <p className="text-sm text-navy-600">© {new Date().getFullYear()} Listeando. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
