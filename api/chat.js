export default async function handler(req, res) {
  const prompt = req.body.prompt;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200, temperature: 0.7 },
      }),
    }
  );

  const data = await response.json();
  const text = data?.[0]?.generated_text || "응답 오류 발생";

  res.status(200).json({ reply: text });
}
