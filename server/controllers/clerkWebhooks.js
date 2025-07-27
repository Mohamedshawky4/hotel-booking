import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;
    console.log("Webhook event type:", type);
    console.log("Webhook data:", data);

    const userData = {
      _id: data.id,
      username: data.first_name + " " + data.last_name,
      email: data.email_addresses[0].email_address,
      image: data.image_url,
      recentSearchedCities: []
    };

    switch (type) {
      case "user.created":
        const newUser = await User.create(userData);
        console.log("User created:", newUser);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        break;
    }

    res.json({ success: true, message: "webhook verified" });
  } catch (error) {
    console.log("Webhook error:", error.message);
    res.status(400).json({ success: false, message: "webhook not verified" });
  }
};

export default clerkWebhook;
