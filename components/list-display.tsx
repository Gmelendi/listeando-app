import { DownloadCSVButton } from "@/components/download-button"
import type { FieldDefinition } from "@/lib/db/models"

interface ListItem {
  position: number
  fields: Record<string, any>
}

interface ListDisplayProps {
  title: string
  items: ListItem[]
  fields: FieldDefinition[]
  showDownload?: boolean
}

export function ListDisplay({ title, items, fields, showDownload = true }: ListDisplayProps) {
  // Find the title and description fields
  const titleField = fields.find((f) => f.name === "title") || fields[0]
  const descField = fields.find((f) => f.name === "description") || fields[1]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-navy-800">{title}</h2>

        {showDownload && (
          <DownloadCSVButton
            listTitle={title}
            items={items}
            fields={fields}
            variant="outline"
            size="sm"
            className="flex items-center text-sm border-teal-200 text-teal-700 hover:bg-teal-50"
          />
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.position} className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-white text-sm font-bold">{item.position}</span>
            </div>
            <div>
              <h4 className="text-navy-800 font-medium">{item.fields[titleField.name]}</h4>
              <p className="text-navy-600 text-sm">{item.fields[descField.name]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
