import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PLATFORM_GUIDELINES = {
  tiktok: {
    duration: '5-9 seconds for micro-content or 60+ seconds for storytelling',
    style: 'Bold, attention-grabbing, trendy. Use reverse storytelling - start with the climax. Micro-storytelling with clear character, conflict, resolution.',
    hook: 'First 3 seconds MUST hook - use surprising visuals or bold statements',
    tips: 'Bold text overlays, trending sounds, relatable content'
  },
  instagram: {
    duration: '15-60 seconds',
    style: 'Visual storytelling with beautiful aesthetics. Before-and-after transformations work well. Focus on relatable, shareable moments.',
    hook: 'Strong visual hook in first 3 seconds',
    tips: 'Montages, product demos, transformations, visually stunning content'
  },
  youtube: {
    duration: '60 seconds to 10+ minutes',
    style: 'In-depth, educational, value-driven. Longer narrative arc with clear structure. Build authority and trust.',
    hook: 'Promise value in first 10 seconds, tease the outcome',
    tips: 'Chapter markers, clear structure, educational depth, personality-driven'
  },
  linkedin: {
    duration: '30-90 seconds',
    style: 'Professional, value-driven, actionable insights. Focus on business outcomes and professional growth.',
    hook: 'Lead with the value proposition or relatable professional challenge',
    tips: 'Professional tone, actionable advice, industry insights, authentic storytelling'
  }
};

export async function generateContent(idea) {
  const prompt = `You are a warm, conversational content creator. Transform this idea into engaging written content.

Idea Title: ${idea.title}
Idea: ${idea.content}

Create content that is:
- Warm and personal in tone
- Conversational and relatable
- Contains a nugget of insight or wisdom
- Engaging and authentic
- Easy to read and understand

Generate 2-3 paragraphs of compelling content based on this idea.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  return message.content[0].text;
}

export async function generateVideoScript(idea, platform) {
  const guidelines = PLATFORM_GUIDELINES[platform.toLowerCase()];

  const prompt = `You are a viral video script writer specializing in ${platform} content. Create a compelling storytelling video script based on this idea.

Idea Title: ${idea.title}
Idea: ${idea.content}

Platform: ${platform}
Duration: ${guidelines.duration}
Style: ${guidelines.style}
Hook Strategy: ${guidelines.hook}
Tips: ${guidelines.tips}

Create a video script with:
1. HOOK (first 3 seconds) - Immediately grab attention
2. STORY - Main narrative with emotional arc
3. INSIGHT - A valuable nugget of wisdom or advice
4. CTA - Call to action (like, share, follow, comment)

Make it warm, personal, conversational, and authentic. The script should feel like a friend sharing valuable advice.

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "hook": "The opening hook text",
  "story": "The main story/narrative",
  "insight": "The key insight or advice",
  "cta": "Call to action",
  "totalDuration": duration in seconds as integer
}`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  const responseText = message.content[0].text.trim();
  let scriptData;

  try {
    scriptData = JSON.parse(responseText);
  } catch (error) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      scriptData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  return scriptData;
}

export async function generateStoryboard(script, platform) {
  const guidelines = PLATFORM_GUIDELINES[platform.toLowerCase()];

  const prompt = `You are a professional storyboard artist. Create a detailed storyboard for this video script.

Platform: ${platform}
Total Duration: ${script.total_duration} seconds

Script:
Hook: ${script.hook}
Story: ${script.story}
Insight: ${script.insight}
CTA: ${script.cta}

Create 4-6 scenes that flow naturally. Each scene should have:
- sequence: Scene number
- duration: How many seconds (total should equal ${script.total_duration})
- visualDescription: What we see on screen (be specific and vivid)
- voiceover: What is being said
- cameraNotes: Camera angles, movements (e.g., "Close-up", "Pan left", "Zoom in", "Wide shot")

Guidelines: ${guidelines.tips}

Return ONLY a JSON array of scenes (no markdown, no code blocks):
[
  {
    "sequence": 1,
    "duration": 3,
    "visualDescription": "description",
    "voiceover": "text",
    "cameraNotes": "notes"
  }
]`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  const responseText = message.content[0].text.trim();
  let scenes;

  try {
    scenes = JSON.parse(responseText);
  } catch (error) {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      scenes = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse storyboard response as JSON');
    }
  }

  return scenes;
}
