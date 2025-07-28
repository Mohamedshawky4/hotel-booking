import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhook = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payloadString = req.body.toString();

    const evt = wh.verify(payloadString, headers);
    const { data, type } = evt;

    console.log("✅ Webhook event type:", type);
    console.log("✅ Webhook data received:", data);
    console.log("Received webhook event:", type, "with data:", data);

const userData = {
  _id: data.id,
  username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
  email: data.email_addresses?.[0]?.email_address || "noemail@example.com", // fallback email
  image: data.image_url || "https://via.placeholder.com/100", // fallback image
  role: "user", // or assign dynamically
  recentSearchedCities: [],
};


    if (!userData.email || !userData._id) {
      console.log("⚠️ Missing required user fields", userData);
    }

    switch (type) {
      case "user.created":
        try {
          console.log("Attempting to create user in DB:", userData);
          const createdUser = await User.create(userData);
          console.log("✅ User created in DB:", createdUser);
        } catch (dbErr) {
          console.error("❌ DB Create Error:", dbErr); // log full error
        }
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User updated in DB");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted from DB");
        break;

      default:
        console.log("ℹ️ Unhandled event type");
        break;
    }

    res.status(200).json({ success: true, message: "Webhook verified and handled" });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: "Webhook not verified" });
  }
};

export default clerkWebhook;
