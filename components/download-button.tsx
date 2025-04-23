"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Download, Check } from "lucide-react"
import { exportListAsCSV } from "@/utils/csv-export"


interface DownloadButtonProps extends ButtonProps {
  listId: string
  data: Record<string, any>[]
  onComplete?: () => void
}

export function DownloadCSVButton({listId, data, onComplete, className, ...props }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)

    try {
      // Export the list as CSV
      exportListAsCSV(listId, data)

      // Show success state
      setIsComplete(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setIsComplete(false)
        setIsDownloading(false)
        if (onComplete) onComplete()
      }, 2000)
    } catch (error) {
      console.error("Error downloading CSV:", error)
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || data.length === 0}
      className={`${className} transition-all duration-300`}
      {...props}
    >
      {isComplete ? (
        <>
          <Check className="mr-2 h-4 w-4 text-teal-500" />
          Downloaded
        </>
      ) : isDownloading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
          Downloading...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download as CSV
        </>
      )}
    </Button>
  )
}
