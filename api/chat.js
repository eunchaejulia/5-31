export default async function handler(req, res) {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/bigscience/bloomz-560m",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 100, temperature: 0.7 },
        }),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      throw new Error(`Invalid JSON: ${text}`);
    }

    const reply = data?.[0]?.generated_text || "모델 응답 실패";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("🔴 오류 발생:", err);
    res.status(500).json({ reply: `서버 오류: ${err.message}` });
  }
}
