import sql from "../configs/db.js";

export const createSecret = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const result = await sql`
      INSERT INTO secrets (message)
      VALUES (${message})
      RETURNING id
    `;

    const secretId = result[0].id;

    res
      .status(201)
      .json({ success: true, message: "Secret created", id: secretId });
  } catch (error) {
    console.error("Error creating secret:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSecret = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
        DELETE FROM secrets
        WHERE id = ${id}
        RETURNING message
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: true,
        message: "Secret not found or already destroyed",
      });
    }

    const secretMessage = result[0].message;
    
    res.status(200).json({ success: true, message: secretMessage });
  } catch (error) {
    console.error("Error retrieving secret:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
