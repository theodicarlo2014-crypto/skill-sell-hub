import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseAuth.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("Not authenticated");

    const { items } = await req.json() as { items: Array<{ listing_id: string }> };
    if (!Array.isArray(items) || items.length === 0) throw new Error("No items");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const ids = items.map(i => i.listing_id);
    const { data: listings, error: lErr } = await supabaseAdmin
      .from("listings")
      .select("id, title, price, seller_id, is_active")
      .in("id", ids);
    if (lErr) throw lErr;
    if (!listings || listings.length !== ids.length) throw new Error("Some listings not found");
    if (listings.some(l => !l.is_active)) throw new Error("Some listings are no longer available");

    // Connect: all items in one checkout must go to the same seller (Stripe limitation for destination charges)
    const sellerIds = [...new Set(listings.map(l => l.seller_id))];
    if (sellerIds.length > 1) {
      throw new Error("Cart contains items from multiple sellers. Please check out one seller at a time.");
    }
    const sellerId = sellerIds[0];

    const { data: sellerProfile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_account_id, stripe_onboarded")
      .eq("user_id", sellerId)
      .maybeSingle();

    if (!sellerProfile?.stripe_account_id || !sellerProfile?.stripe_onboarded) {
      throw new Error("This seller hasn't completed payment setup yet. Please try again later.");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const subtotal = listings.reduce((s, l) => s + Number(l.price), 0);
    const fee = Math.round(subtotal * 0.15 * 100) / 100;
    const totalCents = Math.round((subtotal + fee) * 100);
    const feeCents = Math.round(fee * 100);

    const line_items = listings.map(l => ({
      price_data: {
        currency: "usd",
        product_data: { name: l.title },
        unit_amount: Math.round(Number(l.price) * 100),
      },
      quantity: 1,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Platform fee (15%)" },
        unit_amount: Math.round(fee * 100),
      },
      quantity: 1,
    });

    const origin = req.headers.get("origin") ?? "";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items,
      mode: "payment",
      payment_intent_data: {
        application_fee_amount: feeCents,
        transfer_data: { destination: sellerProfile.stripe_account_id },
      },
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    const orderRows = listings.map(l => ({
      buyer_id: user.id,
      listing_id: l.id,
      amount: Number(l.price),
      platform_fee: Math.round(Number(l.price) * 0.15 * 100) / 100,
      total: Math.round(Number(l.price) * 1.15 * 100) / 100,
      stripe_session_id: session.id,
      status: "pending",
    }));
    await supabaseAdmin.from("orders").insert(orderRows);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
