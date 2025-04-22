import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { researchAndGenerateList } from "@/lib/ai/research-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    if (!webhookSecret) {
      throw new Error("Missing Stripe webhook secret")
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      try {
        // Get the prompt from the metadata
        const prompt = session.metadata?.prompt

        if (!prompt) {
          throw new Error("No prompt found in session metadata")
        }

        // Start the research process
        await researchAndGenerateList(prompt, session.id)

        console.log(`Research started for session: ${session.id}`)
      } catch (error) {
        console.error("Error starting research:", error)
      }
      break

    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed for intent: ${paymentIntent.id}`)
      break

    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new NextResponse(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
