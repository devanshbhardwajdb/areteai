// File: /app/api/result/generateReport.js
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';



if (!admin.apps.length) {
  const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(serviceAccountString);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
const bucket = admin.storage().bucket();

export async function POST(req) {
  try {
    // Expecting the request to include the results and scores
    const { result, totalScore, grandTotal, user } = await req.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    // ── Build a prompt to generate a structured JSON analysis report ──
    const prompt = `
You are an expert in psychological assessments and multiple intelligence analysis.
Given the following assessment data, generate a structured analysis report in valid JSON format with the following structure:

{
  "intelligences": [
    {
      "type": string, // Name of the intelligence (e.g., "Musical Intelligence")
      "percentage": number, // Percentage score (integer between 0 and 100)
      "description": string, // A detailed explanation of this intelligence type and how the user(don't say user say you have performed.) has performed in this intelligence, with atmost 6-7 lines.
      "opportunities": [
          {
              "title": string,
              "description": string,
              "areasForImprovement": string,
              "howToImprove": string
          },
          ... (at least 4 items)
      ],
      "futureSteps": string, // Detailed suggested next steps for improvement in this intelligence, 3-4 lines.
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

    // ── Call OpenAI API with the new prompt ──
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

    // Validate OpenAI response structure
    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid OpenAI response structure');
    }

    const analysisJsonString = aiData.choices[0].message.content;
    let analysisData;

    try {
      analysisData = JSON.parse(analysisJsonString);
    } catch (jsonError) {
      console.error("Raw OpenAI response:", analysisJsonString);
      throw new Error(`JSON parse error: ${jsonError.message}`);
    }
    // console.log(analysisData)

    let executablePath;
    if (process.env.NODE_ENV === 'development') {
      // Provide the path to your locally installed Chrome/Chromium.
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      executablePath = await chromium.executablePath();
    }
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true, // or 'new' if you prefer
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setContent(generateHtmlReport(analysisData), {
      waitUntil: 'networkidle0',
      timeout: 15000
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      timeout: 15000
    });

    await browser.close();

    // Direct upload to Firebase without local storage
    const fileName = `${user.username}-assessment-report-${Date.now()}.pdf`;
    const file = bucket.file(fileName);

    await file.save(pdfBuffer, {
      metadata: { contentType: 'application/pdf' },
    });

    await file.makePublic();
    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error generating PDF:', error);
    return NextResponse.json({
      error: error.message || 'Failed to generate PDF',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, {
      status: error.message.includes('timeout') ? 504 : 500
    });
  }
}

/**
 * Helper function to generate the HTML report.
 * It uses inline CSS and creates a consistent design.
 */
function generateHtmlReport(data) {
  // ── Helper to generate a circular progress chart as an inline SVG ──
  function createCircularChart(percentage) {
    const radius = 35; // Slightly smaller for better spacing
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${radius}" stroke="#e6e6e6" stroke-width="10" fill="none"/>
        <circle cx="50" cy="50" r="${radius}" stroke="#00a6a6" stroke-width="10" fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"/>
        <text x="50" y="55" text-anchor="middle" fill="#333" font-size="16" font-weight="bold">${percentage}%</text>
      </svg>
    `;
  }

  const intelligenceImages = { "Musical Intelligence": "musical.webp", "Linguistics Intelligence": "linguistics.webp", "Spatial Intelligence": "spatial.webp", "Intrapersonal Intelligence": "intrapersonal.webp", "Interpersonal Intelligence": "interpersonal.webp", "Logical-Mathematical Intelligence": "logical-math.webp", "Naturalist Intelligence": "naturalistic.webp", "Bodily-Kinesthetic Intelligence": "bodily.webp", "Moral Intelligence": "moral.webp" };

  // ── Inline CSS styles for a consistent design ──
  const styles = `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
      body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; }
      .report-container { padding: 20px; }
      .title { text-align: center; font-size: 32px; font-weight: bold; margin-bottom: 20px; }
      .title-box { text-align: center; margin-bottom: 20px; display:flex; gap:15px; align-items:center; justify-content:center; }
      .logo { max-width: 60px; margin-bottom: 10px; }
      .section { margin-bottom: 40px; page-break-after: always; }
      .section:last-child { page-break-after: auto; }
      .intelligence-header { display: flex; align-items: start; justify-content: end; flex-direction:column; }
      .intelligence-header h2 { font-size: 24px; margin: 0; color: #00a6a6; }
      .chart { display: inline-block; }
      .para-image { width: 150px; height: auto; margin-left: 10px; vertical-align: middle; }
      .paragraph{ display:flex; align-items:start; gap:10px;}
      .description { margin: 10px 0; text-align:justify; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      table, th, td { border: 1px solid #ccc;  }
      th, td { padding: 5px; text-align: left; }
      th { background-color: #00a6a6; color: #fff; }
      .future-steps { margin: 10px 0; font-style: italic; text-align:justify; }
      .summary { margin: 20px 0; }
      .copyright { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    </style>
  `;

  // ── Build the HTML content ──
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ARETE AI ASSESSMENT REPORT</title>
      ${styles}
    </head>
    <body>
      <div class="report-container">
        <div class="title-box">
          <img src="${process.env.NEXT_PUBLIC_HOST}/logo.png" alt="AreteAI Logo" class="logo">
          <h1 class="title">INTELLIGENCE REPORT</h1>
        </div>
  `;

  // For every intelligence type, generate a new section (each starting on a new page)
  data.intelligences.forEach((intelligence) => {
    const imagePath = `${process.env.NEXT_PUBLIC_HOST}/${intelligenceImages[intelligence.type] || "default.webp"}`;
    html += `
      <div class="section">
        <div class="intelligence-header">
        <div class="chart">
        
        
        ${createCircularChart(intelligence.percentage)}
        
        </div>
        <h2>${intelligence.type}</h2>
        </div>
        <div class="paragraph">
        <p class="description">${intelligence.description}</p>
        <img src="${imagePath}" alt="Para Image" class="para-image">
        </div>
        <table>
          <tr>
            <th>Future Opportunities 🎯</th>
            <th>Description 📖</th>
            <th>Areas for Improvement 🔧</th>
            <th>How to Improve 🚀</th>
          </tr>
    `;
    intelligence.opportunities.forEach((opportunity) => {
      html += `
          <tr>
            <td>${opportunity.title}</td>
            <td>${opportunity.description}</td>
            <td>${opportunity.areasForImprovement}</td>
            <td>${opportunity.howToImprove}</td>
          </tr>
      `;
    });
    html += `
        </table>
        <p class="future-steps"><strong>Future Steps:</strong> ${intelligence.futureSteps}</p>
      </div>
    `;
  });

  // Final Overall Summary Section
  html += `
    <div class="section summary">
      <h2>Overall Summary</h2>
      <p><strong>Strengths:</strong> ${data.overall.strengths}</p>
      <p><strong>Weaknesses:</strong> ${data.overall.weaknesses}</p>
      <p><strong>Future Career Possibilities:</strong> ${data.overall.futureCareerPossibilities}</p>
      <div class="copyright">
        © ARETEAI - All rights reserved. This assessment report is proprietary.
      </div>
    </div>
      </div>
    </body>
    </html>
  `;

  return html;
}
