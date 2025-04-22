import type { FieldDefinition, FieldType } from "@/lib/db/models"

/**
 * Format a field value based on its type
 */
export function formatFieldValue(value: any, type: FieldType): string {
  if (value === null || value === undefined) return ""

  switch (type) {
    case "currency":
      return typeof value === "number" ? `$${value.toFixed(2)}` : `$${value}`
    case "percentage":
      return typeof value === "number" ? `${value}%` : `${value}%`
    case "boolean":
      return value ? "Yes" : "No"
    default:
      return value.toString()
  }
}

/**
 * Converts list data to CSV format with dynamic fields
 */
export function convertListToCSV(
  listTitle: string,
  items: Array<{ position: number; fields: Record<string, any> }>,
  fields: FieldDefinition[],
): string {
  // Create CSV header with dynamic fields
  const header = ["Position", ...fields.map((field) => field.displayName)]

  // Create CSV rows from items
  const rows = items.map((item) => {
    const row = [item.position.toString()]

    // Add each field value in the correct order
    fields.forEach((field) => {
      const value = item.fields[field.name]
      const formattedValue = formatFieldValue(value, field.type)
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
  listTitle: string,
  items: Array<{ position: number; fields: Record<string, any> }>,
  fields: FieldDefinition[],
): void {
  const csvContent = convertListToCSV(listTitle, items, fields)
  const filename = `${sanitizeFilename(listTitle)}-list.csv`
  downloadCSV(csvContent, filename)
}
