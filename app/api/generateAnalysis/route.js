// File: /app/api/generateAnalysis/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { result, totalScore, grandTotal, user } = await req.json();

    // Set a timeout for the OpenAI call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    // Build the prompt for OpenAI
    const prompt = `
    You are an expert in psychological assessments and multiple intelligence analysis.
    Given the following assessment data, generate a structured analysis report in valid JSON format with the following structure:
    
    {
      "intelligences": [
        {
          "type": string, // Name of the intelligence (e.g., "Musical Intelligence")
          "percentage": number, // Percentage score (integer between 0 and 100)
          "description": string, // A detailed explanation of this intelligence type and how the user(don't say user say you have performed.) has performed in this intelligence, with atmost 4-5 lines.
          "opportunities": [
              {
                  "title": string,
                  "description": string,
                  "areasForImprovement": string,
                  "howToImprove": string
              },
              ... (at least 4 items)
          ],
          "futureSteps": string, // Detailed suggested next steps for improvement in this intelligence, 2-3 lines.
        },
        ... (one object per intelligence)
      ],
      "overall": {
        "strengths": string, // Detailed overall strengths based on high scores.
        "weaknesses": string, // Detailed overall weaknesses based on low scores.
        "futureCareerPossibilities": string // Detailed potential career paths based on the assessment.
      }
    }
    
    Please ensure that the description, futureSteps, overall strengths, and weaknesses are detailed and elaborate.
    Input Data:
    - Total Score: ${totalScore} / ${grandTotal}
    - Detailed Intelligence Scores:
    ${Object.keys(result.answers)
            .map(key => {
              const intelligence = result.answers[key];
              const percentage = Math.round((intelligence.pageSum / intelligence.totalSum) * 100);
              return `${key}: ${intelligence.pageSum} / ${intelligence.totalSum} (${percentage}%)`;
            })
            .join("\n")}
    
    Return only valid JSON. Do not include any extra text or markdown formatting.
    
        `;

    // Call the OpenAI API
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          max_tokens: 3000,
          messages: [
            {
              role: 'system',
              content:
                "You are an expert in psychological assessments and multiple intelligence analysis.",
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

    clearTimeout(timeoutId);

    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      throw new Error(`OpenAI API error: ${openAiResponse.status} ${errorBody}`);
    }

    const aiData = await openAiResponse.json();

    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid OpenAI response structure');
    }

    const analysisJsonString = aiData.choices[0].message.content.trim();  
    let analysisData;
    try {
      analysisData = JSON.parse(analysisJsonString);
    } catch (jsonError) {
      console.error("Raw OpenAI response:", analysisJsonString);
      throw new Error(`JSON parse error: ${jsonError.message}`);
    }

    // Return the parsed analysis JSON
    return NextResponse.json({ analysisData });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('timeout') ? 504 : 500 }
    );
  }
}
