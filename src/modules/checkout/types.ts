import type Stripe from "stripe";

export type productMetadata = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
}

export type CheckoutMetadata = {
  userId: string;
}

export type ExpendedLineItems = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: productMetadata;
    }
  }
}