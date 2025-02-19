import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_ROLE = `You are an expert learning styles analyst specializing in VARK analysis. Your role is to:
1. Analyze VARK assessment scores
2. Provide detailed insights on learning preferences
3. Give practical study strategies
4. Maintain a professional and encouraging tone
5. Format response in valid JSON structure`;



export async function POST(req) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  try {
    const { result, user } = await req.json();

    if (!result?.scores || !result.scores.hasOwnProperty('V') ||
      !result.scores.hasOwnProperty('A') || !result.scores.hasOwnProperty('R') ||
      !result.scores.hasOwnProperty('K')) {
      throw new Error('Invalid VARK scores provided');
    }

    // const structuredPrompt = `
    //   Based on VARK assessment scores:
    //   Visual: ${result.scores.V}
    //   Aural: ${result.scores.A}
    //   Read/Write: ${result.scores.R}
    //   Kinesthetic: ${result.scores.K}

    //   Provide analysis in this exact JSON structure:
    //   {
    //     "learningStyles": [
    //       {
    //         "type": string,
    //         "percentage": number,
    //         "description": string,
    //         "studyStrategies": [
    //           {
    //             "title": string,
    //             "description": string,
    //             "areasForImprovement": string,
    //             "howToImprove": string
    //           }
    //         ],
    //         "futureSteps": string
    //       }
    //     ],
    //     "overall": {
    //       "strengths": string,
    //       "weaknesses": string,
    //       "recommendedStudyMethods": string
    //     }
    //   }`;

    const USER_PROMPT = `
Generate a comprehensive learning style analysis for ${user.name} based on these scores:
Visual: ${result.scores.V}%
Reading: ${result.scores.A}%
Auditory: ${result.scores.R}%
Kinesthetic: ${result.scores.K}%

Return only valid JSON matching exactly this structure:
{
  "personalGreeting": {
    "title": string,        // Personalized greeting with name
    "introduction": string, // 2-3 sentences introducing their learning style
    "overview": string     // Brief overview of their dominant styles
  },
  "scores": {
    "visual": number,
    "reading": number,
    "auditory": number,
    "kinesthetic": number
  },
  "detailedAnalysis": {     //Give for all four types VARK
    "learningPreferences": [
      {
        "style": string,          // Name of learning style
        "percentage": number,     // Score percentage
        "strengths": string,      // 2-3 sentences on strengths
        "challenges": string,     // 2-3 sentences on challenges
        "strategies": [
          {
            "title": string,
            "description": string,
            "implementation": string
          }
        ]
      }
    ]
  },
  "practicalApplications": {
    "studyTips": [
      {
        "title": string,
        "description": string,
        "examples": [string]
      }
    ],
    "recommendedTools": [
      {
        "name": string,
        "purpose": string,
        "benefitsForStyle": string
      }
    ]
  },
  "reflectionQuestions": [
    {
      "question": string,
      "purpose": string
    }
  ],
  "nextSteps": {
    "immediateActions": [string],
    "longTermRecommendations": string,
    "resourceSuggestions": [
      {
        "name": string,
        "type": string,
        "benefit": string
      }
    ]
  },
  "conclusion": {
    "summary": string,          // 2-3 sentences summarizing key points
    "encouragement": string     // Positive closing message
  }
}

Guidelines:
1. Make all text content personal, encouraging, and action-oriented
2. Include specific examples and practical applications
3. Focus on strengths while acknowledging areas for improvement
4. Provide concrete, implementable strategies
5. Maintain a positive, empowering tone throughout
6. Ensure all JSON is properly formatted and valid
7. Return only the JSON object with no additional text or explanation`;


    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_ROLE },
        { role: 'user', content: USER_PROMPT }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    clearTimeout(timeoutId);

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    let analysisData;
    try {
      analysisData = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    return NextResponse.json(
      { success: true, analysisData },
      { status: 200 }
    );

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error generating VARK analysis:', error);

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Analysis request timed out' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate analysis',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}