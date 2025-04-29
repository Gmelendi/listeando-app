"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { handlePaymentSuccess } from "../actions/payment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"
import { DownloadCSVButton } from "@/components/download-button"
import { ListDocument } from "@/lib/db/models"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_POLLING_ATTEMPTS = 60; // 5 minutes max (60 * 5 seconds)

interface ListData extends Omit<ListDocument, "_id" | "listId"> {
  _id?: string
  listId?: string
  success?: boolean
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listData, setListData] = useState<ListData | null>(null)
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const [pollingAttempts, setPollingAttempts] = useState(0)

  // Function to check the list status
  const checkListStatus = async () => {
    console.log("Checking list status...")
    if (!sessionId) return

    try {
      const result = await handlePaymentSuccess(sessionId)
      console.log("List status:", result.status)
      setListData(result as ListData)
      setPollingAttempts(prev => prev + 1)

      if (
        result.status === "completed" ||
        result.status === "failed" ||
        pollingAttempts >= MAX_POLLING_ATTEMPTS
      ) {
        // Clear the polling interval if the list is completed or failed
        console.log("Stopping polling...")
        if (pollingInterval.current !== null) {
          console.log("Clearing interval")
          clearInterval(pollingInterval.current!)
          pollingInterval.current = null
        }
        setLoading(false)
        
        if (pollingAttempts >= MAX_POLLING_ATTEMPTS && result.status !== "completed") {
          setError("List generation timed out. Please try again.")
        }
      } else if (result.status === "processing") {
        // Continue polling if the list is still processing
        setLoading(false)
      }
    } catch (err) {
      setError("Failed to process your payment. Please contact support.")
      console.error(err)
      setLoading(false)
      
    }
  }

  useEffect(() => {
    async function processPayment() {
      if (!sessionId) {
        setError("No session ID found")
        setLoading(false)
        return
      }

      try {
        // Initial check
        await checkListStatus()

        // Start polling only if:
        // 1. Component is mounted
        // 2. No existing polling interval
        // 3. List is still processing or pending
        if (listData?.status !== "completed" && listData?.status !== "failed") {
          pollingInterval.current = setInterval(checkListStatus, POLLING_INTERVAL)
          console.log("Polling started")
        }
      } catch (err) {
          setError("Failed to process your payment. Please contact support.")
          console.error(err)
          setLoading(false)
      }
    }

    processPayment()

    return () => {
      if (pollingInterval.current) {
        console.log("Cleaning up polling interval")
        clearInterval(pollingInterval.current)
      }
    }
  }, [sessionId])


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-100 max-w-md w-full text-center shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Processing your payment</h1>
          <p className="text-navy-600">Please wait while we generate your list...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-100 max-w-md w-full text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Something went wrong</h1>
          <p className="text-navy-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // If the list is still processing
  if (listData?.status === "processing" || listData?.status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-100 max-w-md w-full text-center shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Researching your list</h1>
          <p className="text-navy-600 mb-6">
            Our AI is gathering information from multiple sources to create your list...
          </p>
          <div className="w-full bg-sky-50 rounded-full h-2.5 mb-6">
            <div className="bg-teal-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <p className="text-sm text-navy-500">This may take a minute or two. Please don't close this page.</p>
        </div>
      </div>
    )
  }

  // If the list generation failed
  if (listData?.status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-100 max-w-md w-full text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy-800 mb-2">List Generation Failed</h1>
          <p className="text-navy-600 mb-6">
            We encountered an error while generating your list. Please try again or contact support.
          </p>
          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-teal-50 to-white flex items-center justify-center py-12">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-calm-radial opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-calm-glow blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-calm-glow blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-sky-100 max-w-4xl w-full shadow-lg relative z-10">
        <div className="text-center mb-6">
          <CheckCircle className="h-12 w-12 text-teal-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Research Complete!</h1>
          <p className="text-navy-600">Your curated list is ready.</p>
        </div>

        <div className="bg-sky-50/70 rounded-lg p-4 mb-6 border border-sky-100">
          <h2 className="text-lg font-semibold text-navy-800 mb-2">Your Research Request</h2>
          <p className="text-navy-700 italic">"{listData?.prompt}"</p>
        </div>

        {/* Generated List with Download Button */}
        <div className="bg-sky-50/70 rounded-lg p-4 mb-6 border border-sky-100">
          <div className="flex justify-between items-center mb-4 space-x-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-navy-800">
                {listData?.title || "Generated List"}
              </h2>
              {listData?.data && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex flex-row items-center gap-1">
                      <span>Total:</span> {listData.data.length}
                  </Badge>
                </div>
              )}
            </div>

            {/* CSV Download Button */}
            {listData?.data && listData.data.length > 0 && (
              <DownloadCSVButton
                listId={listData.listId || ""}
                data={listData.data}
                variant="outline"
                size="sm"
                className="flex items-center text-sm border-teal-200 text-teal-700 hover:bg-teal-50"
              />
            )}
          </div>

          {/* Table content remains the same */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  {listData?.data?.[0] && Object.keys(listData.data[0]).map((fieldName) => (
                    <TableHead key={fieldName}>
                      <span className="cursor-help">{fieldName}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {listData?.data?.slice(0, 15).map((item, index) => (
                  <TableRow key={index.toString()}>
                    <TableCell>
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </TableCell>
                    {Object.entries(item).map(([fieldName, fieldValue]) => (
                      <TableCell key={fieldName}>
                        <span className="text-navy-700">{String(fieldValue)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>


        <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
              Research Another Topic
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </div>
  )
}
