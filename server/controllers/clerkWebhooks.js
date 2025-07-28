import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhook = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    // ✅ Convert raw buffer to string
    const payloadString = req.body.toString();

    // ✅ Verify and extract Clerk event
    const evt = wh.verify(payloadString, headers);
    const { data, type } = evt;

    console.log("Webhook event type:", type);
    console.log("Webhook data:", data);

    const userData = {
      _id: data.id,
      username: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0]?.email_address,
      image: data.image_url,
      recentSearchedCities: [],
    };

    switch (type) {
      case "user.created":
        const newUser = await User.create(userData);
        console.log("User created:", newUser);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("User updated");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("User deleted");
        break;

      default:
        console.log("Unhandled event type");
        break;
    }

    res.status(200).json({ success: true, message: "Webhook verified and handled" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, message: "Webhook not verified" });
  }
};

export default clerkWebhook;
