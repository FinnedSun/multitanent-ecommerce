import type Stripe from "stripe";
import { getPayload } from "payload";
import config from "@/payload.config";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { console } from "inspector";
import { ExpendedLineItems } from "@/modules/checkout/types";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (error! instanceof Error) {
      console.log(error);
    };

    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook error: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = await getPayload({ config })

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            console.error('❌ Metadata userId tidak ditemukan');
            throw new Error("user ID is required");
          }

          // Tambahkan validasi status pembayaran
          if (data.payment_status !== 'paid') {
            console.error('❌ Pembayaran belum berhasil');
            throw new Error("Pembayaran belum berhasil");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            console.error(`❌ User tidak ditemukan: ${data.metadata.userId}`);
            throw new Error("user not found");
          }

          try {
            const expendedSession = await stripe.checkout.sessions.retrieve(
              data.id,
              {
                expand: ["line_items.data.price.product"],
              },
              {
                stripeAccount: event.account,
              }
            );

            if (
              !expendedSession.line_items?.data ||
              !expendedSession.line_items.data.length
            ) {
              console.error('❌ Produk tidak ditemukan di line items');
              throw new Error("line items not found");
            }

            const lineItems = expendedSession.line_items.data as ExpendedLineItems[];

            for (const item of lineItems) {
              // Validasi product metadata
              if (!item.price?.product?.metadata?.id) {
                console.error('❌ Metadata produk tidak valid');
                continue;
              }

              await payload.create({
                collection: "orders",
                data: {
                  stripeCheckoutSessionId: data.id,
                  stripeAccountId: event.account,
                  user: user.id,
                  product: item.price.product.metadata.id,
                  name: item.price.product.name,
                }
              });
            }
          }
          catch (error) {
            console.error('❌ Error processing checkout session:', error);
            throw error;
          }
          break;

        case "account.updated":
          data = event.data.object as Stripe.Account;

          await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            }
          });
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 400 }
      )
    }
  }

  return NextResponse.json(
    { message: "received" },
    { status: 200 },
  )
};