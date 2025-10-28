// Multi-provider AI Report Generator with Automatic Fallback
// Priority: Gemini (free) -> OpenAI (cheap) -> Hugging Face (free backup)

const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const OPENAI_MODEL = 'gpt-3.5-turbo';
const HF_MODEL = 'mistralai/Mixtral-8x7B-Instruct-v0.1';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' })
    };
  }

  const { prompt, generationConfig } = payload;
  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'The "prompt" field is required and must be a string.' })
    };
  }

  const providers = [
    { name: 'Gemini', fn: callGemini },
    { name: 'OpenAI', fn: callOpenAI },
    { name: 'HuggingFace', fn: callHuggingFace }
  ];

  let lastError = null;
  
  for (const provider of providers) {
    try {
      console.log(`Intentando con ${provider.name}...`);
      const result = await provider.fn(prompt, generationConfig);
      console.log(`✅ ${provider.name} respondió correctamente`);
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: result,
          provider: provider.name,
          success: true
        })
      };
    } catch (error) {
      console.error(`❌ ${provider.name} falló:`, error.message);
      lastError = error;
      
      // Si es error 429 (rate limit) o 403 (quota), intentar siguiente
      if (error.status === 429 || error.status === 403) {
        continue;
      }
      // Si es otro error, también intentar siguiente
      continue;
    }
  }

  // Si todos fallaron
  return {
    statusCode: 503,
    body: JSON.stringify({
      error: 'Todos los proveedores de IA fallaron',
      lastError: lastError?.message || 'Unknown error',
      providers: providers.map(p => p.name)
    })
  };
}

// Provider 1: Google Gemini (Free)
async function callGemini(prompt, config) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: config || {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    })
  });

  if (!response.ok) {
    const error = new Error(`Gemini API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// Provider 2: OpenAI GPT-3.5-Turbo (Paid but cheap)
async function callOpenAI(prompt, config) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente pedagógico experto en educación chilena que genera reportes profesionales y constructivos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.7,
      max_tokens: config?.maxOutputTokens || 2048
    })
  });

  if (!response.ok) {
    const error = new Error(`OpenAI API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Provider 3: Hugging Face (Free backup)
async function callHuggingFace(prompt, config) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY not configured');
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: config?.temperature || 0.7,
          max_new_tokens: config?.maxOutputTokens || 2048,
          return_full_text: false
        }
      })
    }
  );

  if (!response.ok) {
    const error = new Error(`HuggingFace API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data[0].generated_text;
}
