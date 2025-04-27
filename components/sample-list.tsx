import { Button } from "@/components/ui/button"

// Define types for different column formats
type ColumnFormat = "text" | "badge" | "stars" | "progress"

// Define the structure for table columns
interface Column {
  key: string
  header: string
  format: ColumnFormat
  badgeColor?: "teal" | "sky" | "rose" | "red" // For badge format
}

// Define the structure for a row item
interface RowItem {
  [key: string]: any
}

// Define the props for the SampleList component
export interface SampleListProps {
  prompt: string
  columns: Column[]
  data: RowItem[]
  sourcesCount: number
}

export function SampleList({ prompt, columns, data, sourcesCount }: SampleListProps) {
  return (
    <div className="relative group overflow-hidden h-[420px]">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-sky-400/20 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-md overflow-hidden h-full flex flex-col">
        {/* Prompt Header */}
        <div className="bg-gradient-to-r from-teal-500/10 to-sky-500/10 p-3 border-b border-sky-100 h-[90px] flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="text-xs font-medium text-navy-600">User Prompt</div>
          </div>
          <p className="text-navy-800 font-medium text-sm line-clamp-2 h-10 overflow-hidden" title={prompt}>
            "{prompt}"
          </p>
        </div>

        {/* Table Content */}
        <div className="p-5 flex-grow flex flex-col text-sm">
          <div className="overflow-hidden rounded-xl border border-sky-100 bg-white flex-grow flex flex-col">
            {/* Table Header */}
            <div
              className="grid border-b border-sky-100 bg-gradient-to-r from-teal-50 to-sky-50"
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map((column) => (
                <div key={column.key} className="px-3 py-2 font-medium text-navy-800 text-sm">
                  {column.header}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            <div className="flex-grow overflow-auto space-y-2">
              {data.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`grid ${
                    rowIndex < data.length - 1 ? "border-b border-sky-50" : ""
                  } hover:bg-sky-50/50 transition-colors`}
                  style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
                >
                  {columns.map((column) => (
                    <div key={column.key} className="px-3 py-1.5 text-navy-700 text-xs">
                      {renderCellContent(row, column)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

// Helper function to render different cell content based on format
function renderCellContent(row: RowItem, column: Column) {
  const value = row[column.key]

  switch (column.format) {
    case "badge":
      const badgeColorClass =
        column.badgeColor === "teal"
          ? "bg-teal-100 text-teal-800"
          : column.badgeColor === "rose"
            ? "bg-rose-100 text-rose-800"
            : column.badgeColor === "red"
              ? "bg-red-100 text-red-800"
              : "bg-sky-100 text-sky-800"

      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${badgeColorClass}`}>
          {value}
        </span>
      )

    case "stars":
      const [rating, maxRating] = Array.isArray(value) ? value : [value, 10]
      return (
        <div className="flex items-center text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          <span className="ml-1 font-medium">
            {rating}/{maxRating}
          </span>
        </div>
      )

    case "progress":
      const [count, percentage] = Array.isArray(value) ? value : [value, 100]
      return (
        <div className="flex items-center">
          <span className="font-medium text-teal-600 text-sm">{count}</span>
          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
            <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      )

    case "text":
    default:
      return row.isHeader ? <span className="font-medium text-navy-800">{value}</span> : value
  }
}
