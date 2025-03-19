import Stripe from 'stripe'
import { defineEventHandler, readBody, createError } from 'h3'

const config = useRuntimeConfig()
const stripe = new Stripe(config.public.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia'
})

type BillingCycle = 'monthly' | 'yearly'

const priceIds: Record<BillingCycle, string> = {
  monthly: 'price_1R48P9RHz0hGco6ieh64A7Oc',
  yearly: 'price_1R48OWRHz0hGco6ikEziysG7'
}

export default defineEventHandler(async event => {
  try {
    const { billingCycle } = await readBody<{ billingCycle?: string }>(event)

    if (!billingCycle || !(billingCycle in priceIds)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid billing cycle selected.'
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceIds[billingCycle as BillingCycle],
          quantity: 1
        }
      ],
      success_url: `${config.public.FRONTEND_URL}/other/plan?success=true`,
      cancel_url: `${config.public.FRONTEND_URL}/other/plan`
    })

    return { id: session.id }
  } catch (error) {
    throw createError({ statusCode: 400, message: (error as Error).message })
  }
})
