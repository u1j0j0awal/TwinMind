import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { apiKey, endpoint, data } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "No API key provided" });
  }

  try {
    const response = await axios.post(`${GROQ_BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    return res
      .status(error.response?.status || 500)
      .json({
        error:
          error.response?.data?.error?.message || "Failed to call Groq API",
      });
  }
}
