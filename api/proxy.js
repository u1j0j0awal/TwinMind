export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { apiKey, endpoint, data } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "No API key provided" });
  }

  try {
    const response = await fetch(`https://api.groq.com/openai/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: error.error?.message || `API Error: ${response.statusText}` 
      });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to call Groq API" 
    });
  }
}
