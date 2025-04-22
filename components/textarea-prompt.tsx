"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createCheckoutSession } from "@/app/actions/payment"
import { useToast } from "@/hooks/use-toast"
import { DownloadCSVButton } from "@/components/download-button"
import type { FieldDefinition } from "@/lib/db/models"

// Define the list item type for MongoDB
interface ListItem {
  position: number
  fields: Record<string, any>
}

interface TextareaPromptProps {
  existingList?: {
    prompt: string
    items: ListItem[]
    fields: FieldDefinition[]
  }
}

export function TextareaPrompt({ existingList }: TextareaPromptProps) {
  const [prompt, setPrompt] = useState(existingList?.prompt || "")
  const [isLoading, setIsLoading] = useState(false)
  const [characterCount, setCharacterCount] = useState(existingList?.prompt?.length || 0)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setPrompt(value)
    setCharacterCount(value.length)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    try {
      // Create a checkout session with Stripe
      const { url } = await createCheckoutSession(prompt)

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-navy-800 font-medium">
          What information do you need?
        </label>
        <textarea
          id="prompt"
          placeholder="e.g., '10 highest-rated vegan brunch spots in Lisbon with outdoor seating' or '5 evidence-based productivity techniques for remote workers'"
          className="min-h-[120px] rounded-lg bg-white/70 border border-sky-200 px-4 py-3 text-navy-800 placeholder:text-navy-400
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
          value={prompt}
          onChange={handleInputChange}
        />
        <div className="flex justify-between text-xs text-navy-600">
          <span>Be specific about what you're looking for</span>
          <span>{characterCount} characters</span>
        </div>
        <p className="text-xs text-teal-600 mt-1">One-time payment of $5 per research list</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg flex items-center justify-center flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing checkout...
            </>
          ) : (
            "Research & Generate List for $5"
          )}
        </Button>

        {/* Show download button if we have an existing list */}
        {existingList && (
          <DownloadCSVButton
            listTitle={existingList.prompt}
            items={existingList.items}
            fields={existingList.fields}
            variant="outline"
            className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50"
          />
        )}
      </div>

      <div className="flex items-center justify-center space-x-2">
        <svg className="h-5 w-5 text-navy-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs text-navy-500">Secure payment powered by Stripe</span>
      </div>
    </div>
  )
}
