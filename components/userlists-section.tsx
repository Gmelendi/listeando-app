import { SampleList, SampleListProps} from "./sample-list"
import { Button } from "./ui/button"

  // Sample data for the lists
  const fashionBrandsList: SampleListProps = {
    prompt: "Top 10 sustainable fashion brands with price ranges and ethical certifications",
    columns: [
      { key: "brand", header: "Brand", format: "text" },
      { key: "priceRange", header: "Price Range", format: "badge", badgeColor: "teal" },
      { key: "certifications", header: "Certifications", format: "text" },
      { key: "location", header: "Location", format: "text" },
    ],
    data: [
      { brand: "Patagonia", priceRange: "$$$", certifications: "Fair Trade, B Corp", location: "USA", isHeader: true },
      { brand: "Reformation", priceRange: "$$$", certifications: "Climate Neutral", location: "USA", isHeader: true },
      { brand: "Everlane", priceRange: "$$", certifications: "GOTS, Bluesign", location: "USA", isHeader: true },
      { brand: "Veja", priceRange: "$$", certifications: "B Corp, Fair Trade", location: "France", isHeader: true },
      {
        brand: "Eileen Fisher",
        priceRange: "$$$",
        certifications: "B Corp, Bluesign",
        location: "USA",
        isHeader: true,
      },
    ],
    sourcesCount: 12,
  }

const productivityAppsList: SampleListProps = {
    prompt: "Best productivity apps for freelancers with pricing and key features",
    columns: [
      { key: "app", header: "App", format: "text" },
      { key: "category", header: "Category", format: "badge", badgeColor: "sky" },
      { key: "price", header: "Price", format: "text" },
      { key: "keyFeature", header: "Key Feature", format: "text" },
    ],
    data: [
      {
        app: "Notion",
        category: "All-in-one",
        price: "Free-$8/mo",
        keyFeature: "Customizable workspace",
        isHeader: true,
      },
      {
        app: "Toggl",
        category: "Time Tracking",
        price: "Free-$18/mo",
        keyFeature: "One-click tracking",
        isHeader: true,
      },
      {
        app: "Trello",
        category: "Project Management",
        price: "Free-$10/mo",
        keyFeature: "Kanban boards",
        isHeader: true,
      },
      {
        app: "Calendly",
        category: "Scheduling",
        price: "Free-$8/mo",
        keyFeature: "Automated scheduling",
        isHeader: true,
      },
      {
        app: "FreshBooks",
        category: "Accounting",
        price: "$15-$50/mo",
        keyFeature: "Invoice automation",
        isHeader: true,
      },
    ],
    sourcesCount: 8,
  }

const researchPapersList: SampleListProps = {
    prompt: "Most cited research papers on climate change solutions from the last 5 years",
    columns: [
      { key: "title", header: "Title", format: "text" },
      { key: "authors", header: "Authors", format: "text" },
      { key: "journal", header: "Journal", format: "text" },
      { key: "citations", header: "Citations", format: "progress" },
    ],
    data: [
      {
        title: "Renewable Energy Solutions",
        authors: "Zhang et al.",
        journal: "Nature Climate",
        citations: [1245, 100],
        isHeader: true,
      },
      {
        title: "Carbon Capture Technologies",
        authors: "Johnson, P.",
        journal: "Science",
        citations: [987, 80],
        isHeader: true,
      },
      {
        title: "Sustainable Agriculture",
        authors: "Patel & Kim",
        journal: "Env. Science",
        citations: [876, 70],
        isHeader: true,
      },
      {
        title: "Urban Planning",
        authors: "Martinez et al.",
        journal: "Urban Studies",
        citations: [754, 60],
        isHeader: true,
      },
      {
        title: "Electric Vehicle Impact",
        authors: "Lee & Wong",
        journal: "Energy Policy",
        citations: [689, 55],
        isHeader: true,
      },
    ],
    sourcesCount: 15,
  }

const hikingTrailsList: SampleListProps = {
    prompt: "Best hiking trails in California with difficulty levels and scenic ratings",
    columns: [
      { key: "trailName", header: "Trail Name", format: "text" },
      { key: "location", header: "Location", format: "text" },
      { key: "difficulty", header: "Difficulty", format: "badge", badgeColor: "rose" },
      { key: "scenicRating", header: "Scenic Rating", format: "stars" },
    ],
    data: [
      { trailName: "Mist Trail", location: "Yosemite", difficulty: "Moderate", scenicRating: "9.8/10", isHeader: true },
      { trailName: "Half Dome", location: "Yosemite", difficulty: "Difficult", scenicRating: "9.9/10", isHeader: true },
      {
        trailName: "Mount Whitney",
        location: "Sierra Nevada",
        difficulty: "Very Difficult",
        scenicRating: "9.7/10",
        isHeader: true,
      },
      {
        trailName: "Dipsea Trail",
        location: "Marin County",
        difficulty: "Moderate",
        scenicRating: "9.2/10",
        isHeader: true,
      },
      {
        trailName: "Lost Coast Trail",
        location: "Humboldt County",
        difficulty: "Moderate",
        scenicRating: "9.6/10",
        isHeader: true,
      },
    ],
    sourcesCount: 10,
  } 

export default function SampleLists() {
    return (
        <div className="relative py-24 bg-gradient-to-b from-sky-50 to-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-navy-900 mb-4 text-center">
            Real lists from real users
        </h2>
        <p className="text-lg text-navy-700 mb-12 max-w-2xl mx-auto text-center">
            See how our users are leveraging Listeando to create valuable, data-driven lists in seconds.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Using the SampleList component for each list */}
            <SampleList
                prompt={fashionBrandsList.prompt}
                columns={fashionBrandsList.columns}
                data={fashionBrandsList.data}
                sourcesCount={fashionBrandsList.sourcesCount}
            />

            <SampleList
                prompt={productivityAppsList.prompt}
                columns={productivityAppsList.columns}
                data={productivityAppsList.data}
                sourcesCount={productivityAppsList.sourcesCount}
            />

            <SampleList
                prompt={researchPapersList.prompt}
                columns={researchPapersList.columns}
                data={researchPapersList.data}
                sourcesCount={researchPapersList.sourcesCount}
            />

            <SampleList
                prompt={hikingTrailsList.prompt}
                columns={hikingTrailsList.columns}
                data={hikingTrailsList.data}
                sourcesCount={hikingTrailsList.sourcesCount}
            />
        </div>

        <div className="mt-12 text-center">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Create Your Own List</Button>
        </div>
        </div>
        </div>
    )
}