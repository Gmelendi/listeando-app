"use server"
import Stripe from "stripe"
import { researchAndGenerateList, getListBySessionId } from "@/lib/ai/research-service"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(prompt: string) {
  try {
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Custom List Generation",
              description: `List: "${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}"`,
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        prompt: prompt.substring(0, 500), // Store the prompt in metadata (limited to 500 chars)
      },
    })

    // Return the session ID and URL
    return {
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function handlePaymentSuccess(sessionId: string) {
  try {
    // Retrieve the session to get the payment details and metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }

    // Get the prompt from the metadata
    const prompt = session.metadata?.prompt

    if (!prompt) {
      throw new Error("No prompt found in session metadata")
    }

    // Check if we already have a list for this session
    const existingList = await getListBySessionId(sessionId)

    if (existingList) {
      // If the list exists and is completed, return it
      if (existingList.status === "completed") {
        return {
          success: true,
          prompt,
          sessionId,
          listId: existingList._id,
          title: existingList.title,
          fields: existingList.fields,
          items: existingList.items,
          sources: existingList.sources,
          status: existingList.status,
        }
      }

      // If the list is still processing, return the status
      return {
        success: true,
        prompt,
        sessionId,
        listId: existingList._id,
        status: existingList.status,
      }
    }

    // Start the research process
    const listId = await researchAndGenerateList(prompt, sessionId)

    // Return the list ID and status
    return {
      success: true,
      prompt,
      sessionId,
      listId,
      status: "processing",
    }
  } catch (error) {
    console.error("Error handling payment success:", error)
    throw new Error("Failed to process payment confirmation")
  }
}
