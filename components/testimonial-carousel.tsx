"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Testimonial data
const testimonials = [
  {
    quote:
      "Listeando uncovered hidden gems for my Bali travel guide that weren't even on the first three pages of search results. My article engagement increased by 78% and readers keep asking how I found such authentic local spots.",
    name: "Talia Taylor",
    title: "Travel Blogger, The Wandering Lens",
  },
  {
    quote:
      "I used to spend 15+ hours weekly on research for my YouTube channel. With Listeando, I've cut that down to just 3 hours while discovering more diverse sources. This tool has literally bought me an extra day each week to focus on creating.",
    name: "Alex Chen",
    title: "Content Creator, 500K+ Subscribers",
  },
  {
    quote:
      "Our product team needed to analyze competitor features across 30+ platforms. Listeando compiled comprehensive insights in 45 minutes that would have taken our team days. This directly influenced our roadmap and helped us identify a critical market gap.",
    name: "Sarah Martinez",
    title: "Senior Product Manager, TechFlow",
  },
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToSlide = (index: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentIndex(index)

    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length
    goToSlide(newIndex)
  }

  const goToPrev = () => {
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    goToSlide(newIndex)
  }

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    }

    if (isRightSwipe) {
      goToPrev()
    }

    // Reset values
    setTouchStart(0)
    setTouchEnd(0)
  }

  // Auto-advance carousel (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 8000)

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div className="relative mt-0 bg-gradient-to-b from-sky-50 to-white py-24">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-navy-900 mb-4 text-center">
          Transform Your Research Process in Minutes, Not Hours
        </h2>
        <p className="text-lg text-navy-600 text-center max-w-3xl mx-auto mb-12">
          Join thousands of professionals who've revolutionized how they gather and synthesize information
        </p>

        {/* Carousel container */}
        <div
          className="relative overflow-hidden min-h-[400px] md:min-h-[350px]"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "absolute top-0 left-0 w-full px-4 md:px-12 transition-opacity duration-500 ease-in-out",
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-teal-400/10 blur-xl group-hover:bg-teal-400/15 transition-colors duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-sky-100 shadow-md h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-teal-500">
                      <Quote size={32} />
                    </div>
                    <blockquote className="flex-1 mb-6">
                      <p className="text-lg font-medium text-navy-800">"{testimonial.quote}"</p>
                    </blockquote>
                    <footer>
                      <div className="font-medium text-navy-900">{testimonial.name}</div>
                      <div className="text-sm text-navy-600">{testimonial.title}</div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-white/80 border border-sky-100 shadow-sm text-navy-700 hover:bg-sky-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Indicators */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  currentIndex === index ? "bg-teal-500" : "bg-sky-200 hover:bg-sky-300",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white/80 border border-sky-100 shadow-sm text-navy-700 hover:bg-sky-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
