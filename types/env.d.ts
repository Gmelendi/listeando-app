declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_SECRET_KEY: string
    NEXT_PUBLIC_BASE_URL: string
    MONGODB_URI: string
    OPENAI_API_KEY: string
  }
}
