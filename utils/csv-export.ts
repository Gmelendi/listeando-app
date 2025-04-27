/**
 * Converts list data to CSV format with dynamic fields
 */
export function convertListToCSV(
  data: Array<{ [key: string]: any }> // array of arbitrary objects
): string {
  // Handle empty array
  if (!data || !data.length) {
    return ""
  }

  // Get all possible keys from all objects
  const allKeys = Array.from(
    new Set(
      data.reduce((keys: string[], item) => {
        if (item && typeof item === 'object') {
          return [...keys, ...Object.keys(item)]
        }
        return keys
      }, [])
    )
  )

  // Handle case where no valid objects found
  if (!allKeys.length) {
    return ""
  }

  // Create CSV header
  const header = allKeys.map((key) => `"${key}"`)

  // Create CSV rows from items
  const rows = data.map((item) => {
    const row: string[] = []

    // Add each field value in the correct order
    allKeys.forEach((fieldName: string) => {
      const value = item && typeof item === 'object' ? item[fieldName] : ''
      const formattedValue = value !== null && value !== undefined ? value.toString() : ''
      row.push(`"${formattedValue.replace(/"/g, '""')}"`) // Escape quotes in CSV
    })

    return row
  })

  // Combine header and rows
  const csvContent = [header.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

/**
 * Triggers download of a CSV file in the browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  // Add link to document, click it, and remove it
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Helper function to sanitize a string for use in a filename
 */
export function sanitizeFilename(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .substring(0, 50) // Limit length
}

/**
 * Main function to export list data as CSV and trigger download
 */
export function exportListAsCSV(
  listId: string,
  data: Array<{}>
): void {
  const csvContent = convertListToCSV(data)
  const filename = `${sanitizeFilename(listId)}-list.csv`
  downloadCSV(csvContent, filename)
}
