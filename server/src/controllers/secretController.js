import sql from "../configs/db.js";
import { nanoid } from "nanoid";

export const createSecret = async (req, res) => {
  try {
    const { message } = req.body;

    const slug = nanoid(12);

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const result = await sql`
      INSERT INTO secrets (slug, message)
      VALUES (${slug}, ${message})
      RETURNING slug
    `;

    res
      .status(201)
      .json({ success: true, message: "Secret created", slug: result[0].slug });
  } catch (error) {
    console.error("Error creating secret:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSecret = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await sql`
        DELETE FROM secrets
        WHERE slug = ${slug}
        RETURNING message, created_at
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: true,
        message: "Secret not found or already destroyed",
      });
    }

    const secretCreatedAt = new Date(result[0].created_at).getTime();

    const TIME_LIMIT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const currentTime = new Date().getTime();

    const timeDifference = currentTime - secretCreatedAt;

    if (timeDifference > TIME_LIMIT) {
      res.status(410).json({
        success: true,
        message: "Secret expired",
      });
    }
    const secretMessage = result[0].message;

    res.status(200).json({ success: true, message: secretMessage });
  } catch (error) {
    console.error("Error retrieving secret:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
