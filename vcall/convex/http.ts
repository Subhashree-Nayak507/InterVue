import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
// webhookEvent tells your code what properties to expect in a webhook payload.

import { Webhook } from "svix";
import { api } from "./_generated/api";
//api object is the bridge between your frontend code and your backend database logic.

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    //ctx: object that gives your function access to the database, authentication info, and ability to run other functions.
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }
  // Svix is a service that specializes in webhook management. Clerk uses Svix to handle webhook delivery and signature verification.  
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");
    
    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }
    
    const payload = await request.json();
    const body = JSON.stringify(payload);
    
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;
    
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }
    
    const eventType = evt.type;
    // it ensures the webhook actually came from Clerk
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      
      try {
        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }
    
    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;