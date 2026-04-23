// netlify/functions/ai-report.js
// Multi-provider AI report generator with DEMO fallback.
// Prioridad: Groq -> Gemini 1.5 Flash -> OpenAI -> HuggingFace -> Modo Demo.
// Configura en Netlify las variables que tengas: GROQ_API_KEY, GEMINI_API_KEY,
// OPENAI_API_KEY, HUGGINGFACE_API_KEY. Si ninguna responde, se entrega un
// informe en "Modo Demo" para que el botón siempre devuelva algo útil.

export async function handler(event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON inválido' }) }; }

  const prompt = (payload.prompt || '').toString();
  const cfg = payload.generationConfig || {};
  const temperature = typeof cfg.temperature === 'number' ? cfg.temperature : 0.7;
  const maxTokens = Math.min(parseInt(cfg.maxOutputTokens || 2048, 10) || 2048, 4096);

  if (!prompt.trim()) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'El campo "prompt" es obligatorio.' }) };
  }

  const keys = {
    groq:   process.env.GROQ_API_KEY || '',
    gemini: process.env.GEMINI_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    hf:     process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || ''
  };

  const errors = [];

  // 1) GROQ — rápido, gratuito y generoso. Recomendado.
  if (keys.groq) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${keys.groq}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'Eres un asesor pedagógico experto en evaluación formativa en Chile. Respondes en español con secciones claras, encabezados y viñetas.' },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: maxTokens
        })
      });
      if (r.ok) {
        const data = await r.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) return ok(CORS, { text, provider: 'Groq (Llama 3.1 8B)', success: true });
        errors.push({ provider: 'Groq', error: 'Respuesta vacía', status: r.status });
      } else {
        errors.push({ provider: 'Groq', error: (await r.text()).slice(0, 200), status: r.status });
      }
    } catch (e) { errors.push({ provider: 'Groq', error: e.message }); }
  }

  // 2) GEMINI 1.5 FLASH — endpoint actualizado (el antiguo "gemini-pro" da 404).
  if (keys.gemini) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${encodeURIComponent(keys.gemini)}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens, topK: 40, topP: 0.95 }
        })
      });
      if (r.ok) {
        const data = await r.json();
        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n').trim();
        if (text) return ok(CORS, { text, provider: 'Google Gemini 1.5 Flash', success: true });
        errors.push({ provider: 'Gemini', error: 'Respuesta vacía', status: r.status });
      } else {
        errors.push({ provider: 'Gemini', error: (await r.text()).slice(0, 200), status: r.status });
      }
    } catch (e) { errors.push({ provider: 'Gemini', error: e.message }); }
  }

  // 3) OPENAI — gpt-4o-mini (más barato y moderno).
  if (keys.openai) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${keys.openai}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Eres un asesor pedagógico experto en educación chilena. Respondes en español con encabezados y viñetas.' },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: maxTokens
        })
      });
      if (r.ok) {
        const data = await r.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) return ok(CORS, { text, provider: 'OpenAI GPT-4o-mini', success: true });
        errors.push({ provider: 'OpenAI', error: 'Respuesta vacía', status: r.status });
      } else {
        errors.push({ provider: 'OpenAI', error: (await r.text()).slice(0, 200), status: r.status });
      }
    } catch (e) { errors.push({ provider: 'OpenAI', error: e.message }); }
  }

  // 4) HUGGINGFACE — Mistral-7B-Instruct-v0.3 (endpoint serverless vigente).
  if (keys.hf) {
    try {
      const r = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${keys.hf}` },
        body: JSON.stringify({
          inputs: `<s>[INST] ${prompt} [/INST]`,
          parameters: { max_new_tokens: maxTokens, temperature, return_full_text: false }
        })
      });
      if (r.ok) {
        const data = await r.json();
        const text = Array.isArray(data) ? (data[0]?.generated_text || '').trim() : (data?.generated_text || '').trim();
        if (text) return ok(CORS, { text, provider: 'HuggingFace Mistral 7B', success: true });
        errors.push({ provider: 'HuggingFace', error: 'Respuesta vacía', status: r.status });
      } else {
        errors.push({ provider: 'HuggingFace', error: (await r.text()).slice(0, 200), status: r.status });
      }
    } catch (e) { errors.push({ provider: 'HuggingFace', error: e.message }); }
  }

  // 5) MODO DEMO — análisis determinístico a partir del propio prompt.
  const demoText = buildDemoReport(prompt);
  return ok(CORS, {
    text: demoText,
    provider: 'Modo Demo (sin API key activa)',
    demo: true,
    success: true,
    details: errors,
    debug: {
      hasGroqKey:   !!keys.groq,
      hasGeminiKey: !!keys.gemini,
      hasOpenAIKey: !!keys.openai,
      hasHFKey:     !!keys.hf
    }
  });
}

function ok(headers, body) {
  return { statusCode: 200, headers, body: JSON.stringify(body) };
}

// ---------- MODO DEMO ----------
function buildDemoReport(prompt) {
  const isIndividual  = /PERFIL DEL ESTUDIANTE/i.test(prompt);
  const isGrupal      = /DATOS DEL CURSO/i.test(prompt);
  const isEstudiantes = /ANÁLISIS GRUPAL/i.test(prompt);

  const take = (re) => { const m = prompt.match(re); return m ? m[1].trim() : null; };
  const nombre   = take(/Nombre:\s*([^\n]+)/);
  const nota     = take(/Nota actual:\s*([\d.]+)/);
  const tasa     = take(/Tasa de completación:\s*([\d.]+)%/);
  const totalEst = take(/Estudiantes activos:\s*(\d+)/);
  const totalT   = take(/Tareas evaluadas:\s*(\d+)/);

  const bajas = [];
  const altas = [];
  const reTarea = /-\s+(.+?)\s+\[.+?\].+?\n\s+OA:\s+([^\n|]+).+?Logro:\s+\d+\/\d+\s+estudiantes\s+\((\d+)%\)/gs;
  let mm;
  while ((mm = reTarea.exec(prompt)) !== null) {
    const pct = parseInt(mm[3], 10);
    const entry = { nombre: mm[1].trim(), oa: mm[2].trim(), pct };
    if (pct < 60) bajas.push(entry);
    if (pct >= 80) altas.push(entry);
  }

  const fecha = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  const header = `### Informe pedagógico automático\n_Generado en modo demo · ${fecha}_\n\n`;

  if (isIndividual) {
    return header +
`## Evaluación personalizada${nombre ? ` — ${nombre}` : ''}

El estudiante presenta una **tasa de completación del ${tasa ?? '—'}%** con una **nota actual de ${nota ?? '—'}**. El desempeño muestra ${Number(tasa) >= 70 ? 'un compromiso consistente con los aprendizajes propuestos' : 'oportunidades claras de fortalecimiento en hábitos de estudio y entrega oportuna'}.

### Fortalezas destacadas
- Participa de forma regular en las tareas asignadas.
- ${altas.length ? `Buen desempeño en: ${altas.slice(0,3).map(a=>a.nombre).join(', ')}.` : 'Muestra disposición al trabajo en aula.'}
- Capacidad para responder a consignas con estructura clara.

### Áreas de crecimiento
${bajas.length ? bajas.slice(0,4).map(b=>`- **${b.nombre}** (${b.oa}) — logro ${b.pct}%. Requiere apoyo puntual.`).join('\n') : '- Reforzar entrega a tiempo y autorregulación del trabajo autónomo.'}

### Recomendaciones prácticas
1. Retroalimentación dialogada sobre las tareas con menor logro.
2. Organizar una pauta semanal con 2–3 metas concretas.
3. Reforzar comprensión lectora con textos breves + preguntas guía.
4. Espacios de metacognición al cierre de cada clase (¿qué aprendí?, ¿qué me falta?).

### Mensaje motivador
Cada avance cuenta. Con acompañamiento y metas alcanzables, el o la estudiante puede consolidar los aprendizajes pendientes y proyectar un cierre de período positivo. ¡Confía en el proceso!`;
  }

  if (isGrupal) {
    return header +
`## Evaluación general del curso

El curso registra **${totalEst ?? '—'} estudiantes activos** y **${totalT ?? '—'} tareas evaluadas**. El panorama muestra ${bajas.length > altas.length ? 'áreas de aprendizaje que requieren intervención focalizada' : 'un desempeño general favorable con aprendizajes consolidados'}.

### Fortalezas
${altas.length ? altas.slice(0,4).map(a=>`- **${a.nombre}** (${a.oa}) — ${a.pct}% de logro.`).join('\n') : '- Participación sostenida y compromiso con las evaluaciones formativas.'}

### Áreas de mejora
${bajas.length ? bajas.slice(0,5).map(b=>`- **${b.nombre}** (${b.oa}) — logro ${b.pct}%. Sugiere retroenseñanza.`).join('\n') : '- Profundizar en autonomía lectora y producción escrita estructurada.'}

### Análisis pedagógico por OA
- Los OA con menor porcentaje de logro deben abordarse con **estrategias diferenciadas** y material de refuerzo específico.
- Los OA dominados pueden transferirse a tareas más desafiantes o integradoras.

### Plan de acción (próximas 3 semanas)
1. Retroalimentación grupal de las tareas con logro <60%.
2. Taller focalizado en los OA de menor desempeño (45 min, 2 veces por semana).
3. Tutoría entre pares para estudiantes con bajo rendimiento.
4. Reevaluación formativa corta al término de la segunda semana.
5. Ajuste de ponderaciones y criterios de logro según evidencia.`;
  }

  if (isEstudiantes) {
    return header +
`## Análisis grupal de desempeño

Se analiza la distribución del rendimiento del curso para identificar patrones y tomar decisiones pedagógicas.

### Patrones identificados
- Distribución típica en tres tramos: alto, medio y bajo rendimiento.
- Los estudiantes con baja tasa de completación se concentran en OA específicos.

### Segmentación y necesidades
- **Alto rendimiento:** proponer tareas de profundización e interdisciplinarias.
- **Rendimiento medio:** reforzar estrategias metacognitivas y rutinas de estudio.
- **Bajo rendimiento:** intervención focalizada con apoyo 1 a 1 y metas cortas.

### Decisiones de intervención
1. Agrupamiento flexible por nivel de logro durante 2 semanas.
2. Material de refuerzo selectivo por OA no logrado.
3. Reuniones breves de seguimiento cada 10 días.
4. Coordinación con apoderados en casos críticos.

### Indicadores de seguimiento
- % de tareas completadas por tramo.
- Movilidad entre tramos tras las intervenciones.
- Logro por OA en evaluaciones formativas cortas.`;
  }

  return header + 'Se generó un informe demostrativo. Configura una API key (GROQ_API_KEY recomendada) en Netlify para obtener análisis con IA real.';
}
