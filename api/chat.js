// v3 - openrouter
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: system },
          ...messages
        ]
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content;
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
