import { NextResponse } from 'next/server';

// Helper function to generate analysis for one intelligence
async function generateIntelligenceAnalysis(key, intelligence) {
  const percentage = Math.round((intelligence.pageSum / intelligence.totalSum) * 100);
  
  // Build a concise prompt for this intelligence
  const prompt = `
You are an expert in psychological assessments and multiple intelligence analysis.
Analyze the intelligence "${key}" with the following score data:
Score: ${intelligence.pageSum} / ${intelligence.totalSum} (${percentage}%).
Generate a JSON object with these keys:
{
  "type": string,
  "percentage": number,
  "description": string,           // A 4-5 line explanation
  "opportunities": [               // An array with at least 3 items. Each item has:
       { "title": string, "description": string, "areasForImprovement": string, "howToImprove": string }
  ],
  "futureSteps": string            // A 1-2 line summary of recommended next steps
}
Return only valid JSON with no extra text.
  `;

  // Set up an AbortController with a 60-second timeout for this call
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      max_tokens: 4000,
      messages: [
        { role: 'system', content: "You are an expert in psychological assessments and multiple intelligence analysis." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error for intelligence "${key}": ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error(`Invalid OpenAI response structure for intelligence "${key}"`);
  }

  const content = data.choices[0].message.content.trim();
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`Raw OpenAI response for intelligence "${key}":`, content);
    throw new Error(`JSON parse error for intelligence "${key}": ${err.message}`);
  }
}

// Helper function to generate overall analysis
async function generateOverallAnalysis(totalScore, grandTotal, intelligenceAnalyses) {
  let prompt = `
You are an expert in psychological assessments and multiple intelligence analysis.
Given the total score of ${totalScore} out of ${grandTotal} and the following individual intelligence results:
`;

  // Append each intelligence's type and percentage
  for (const analysis of intelligenceAnalyses) {
    prompt += `\n${analysis.type}: ${analysis.percentage}%`;
  }

  prompt += `
Generate an overall analysis in valid JSON with these keys:
{
  "strengths": string,
  "weaknesses": string,
  "futureCareerPossibilities": string
}
Return only valid JSON with no extra text.
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      max_tokens: 4000,
      messages: [
        { role: 'system', content: "You are an expert in psychological assessments and multiple intelligence analysis." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error for overall analysis: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error(`Invalid OpenAI response structure for overall analysis`);
  }

  const content = data.choices[0].message.content.trim();
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Raw OpenAI response for overall analysis:", content);
    throw new Error(`JSON parse error for overall analysis: ${err.message}`);
  }
}

export async function POST(req) {
  try {
    const { result, totalScore, grandTotal, user } = await req.json();

    const intelligenceKeys = Object.keys(result.answers);

    // Process each intelligence analysis in parallel
    const intelligenceAnalyses = await Promise.all(
      intelligenceKeys.map(key =>
        generateIntelligenceAnalysis(key, result.answers[key])
      )
    );

    // Generate the overall analysis based on total scores and individual analyses
    const overallAnalysis = await generateOverallAnalysis(totalScore, grandTotal, intelligenceAnalyses);

    // Combine the individual intelligence analyses and overall analysis
    const combinedAnalysis = {
      intelligences: intelligenceAnalyses,
      overall: overallAnalysis,
    };

    return NextResponse.json({ analysisData: combinedAnalysis });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('timeout') ? 504 : 500 }
    );
  }
}
