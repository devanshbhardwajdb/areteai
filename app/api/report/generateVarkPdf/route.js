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
function generateHtmlReport(data) {
  // Helper function for circular chart (reused from MIT report)
  function createCircularChart(percentage, color) {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${radius}" stroke="#e6e6e6" stroke-width="10" fill="none"/>
        <circle cx="50" cy="50" r="${radius}" stroke="${color}" stroke-width="10" fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"/>
        <text x="50" y="55" text-anchor="middle" fill="#333" font-size="16" font-weight="bold">${percentage}%</text>
      </svg>
    `;
  }

  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
      
      body {
        font-family: 'Montserrat', sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
      }
      
      .report-container {
        padding: 20px;
      }
      
      .title-box {
        text-align: center;
        margin-bottom: 40px;
        display: flex;
        gap: 15px;
        align-items: center;
        justify-content: center;
      }
      
      .logo {
        max-width: 60px;
      }
      
      .title {
        font-size: 32px;
        font-weight: bold;
        color: #000;
      }
      
      .section {
        margin-bottom: 40px;
        page-break-after: always;
      }
      
      .section:last-child {
        page-break-after: auto;
      }
      
      .overview-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin: 30px 0;
      }
      
      .style-overview {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border-radius: 8px;
        background: #f8f9fa;
      }
      
      .learning-style-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .style-title {
        font-size: 24px;
        color: #00a6a6;
        margin: 0;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      
      th {
        background-color: #00a6a6;
        color: white;
      }
      
      .strategy-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
      }
      
      .reflection-section {
        background: #f0f7f7;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .next-steps {
        background: #e6f3f3;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .copyright {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 40px;
        border-top: 1px solid #eee;
        padding-top: 20px;
      }
      
      .style-colors {
        --visual-color: #4CAF50;
        --auditory-color: #2196F3;
        --reading-color: #9C27B0;
        --kinesthetic-color: #FF9800;
      }
    </style>
  `;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>VARK Learning Style Report</title>
      ${styles}
    </head>
    <body class="style-colors">
      <div class="report-container">
        <div class="title-box">
          <img src="${process.env.NEXT_PUBLIC_HOST}/logo.png" alt="AreteAI Logo" class="logo">
          <h1 class="title">VARK LEARNING STYLE REPORT</h1>
        </div>

        <div class="section">
          <div class="personal-greeting">
            <h2>${data.personalGreeting.title}</h2>
            <p>${data.personalGreeting.introduction}</p>
            <p>${data.personalGreeting.overview}</p>
          </div>

          <div class="overview-grid">
            ${Object.entries(data.scores).map(([style, score]) => `
              <div class="style-overview">
                ${createCircularChart(score,
    style === 'visual' ? '#4CAF50' :
      style === 'auditory' ? '#2196F3' :
        style === 'reading' ? '#9C27B0' :
          '#FF9800'
  )}
                <div>
                  <h3>${style.charAt(0).toUpperCase() + style.slice(1)}</h3>
                  <p>${score}% Preference</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${data.detailedAnalysis.learningPreferences.map(style => `
          <div class="section">
            <div class="learning-style-header">
              <h2 class="style-title">${style.style}</h2>
              ${createCircularChart(style.percentage,
    style.style.toLowerCase().includes('visual') ? '#4CAF50' :
      style.style.toLowerCase().includes('auditory') ? '#2196F3' :
        style.style.toLowerCase().includes('reading') ? '#9C27B0' :
          '#FF9800'
  )}
            </div>
            
            <div class="style-content">
              <h3>Strengths</h3>
              <p>${style.strengths}</p>
              
              <h3>Challenges</h3>
              <p>${style.challenges}</p>
              
              <table>
                <tr>
                  <th>Strategy</th>
                  <th>Description</th>
                  <th>Implementation</th>
                </tr>
                ${style.strategies.map(strategy => `
                  <tr>
                    <td>${strategy.title}</td>
                    <td>${strategy.description}</td>
                    <td>${strategy.implementation}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        `).join('')}

        <div class="section">
          <h2 class="style-title">Practical Applications</h2>
          <div class="study-tips">
            <table>
              <tr>
                <th>Study Tip</th>
                <th>Description</th>
                <th>Examples</th>
              </tr>
              ${data.practicalApplications.studyTips.map(tip => `
                <tr>
                  <td>${tip.title}</td>
                  <td>${tip.description}</td>
                  <td>${tip.examples.join('<br>')}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          <h2 class="style-title">Self-Reflection Questions</h2>
          <div class="reflection-section">
            ${data.reflectionQuestions.map(question => `
              <div class="strategy-card">
                <h4>${question.question}</h4>
                <p><em>Purpose:</em> ${question.purpose}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="next-steps">
            <h3>Next Steps</h3>
            <ul>
              ${data.nextSteps.immediateActions.map(action => `
                <li>${action}</li>
              `).join('')}
            </ul>
            <p><strong>Long-term plan:</strong> ${data.nextSteps.longTermRecommendations}</p>
          </div>
           <h2 class="style-title">Conclusion</h2>
          <p>${data.conclusion.summary}</p>
          <p><em>${data.conclusion.encouragement}</em></p>
          
          <div class="copyright">
            © ARETEAI - All rights reserved. This learning style assessment report is proprietary.
          </div>
        </div>

      
      </div>
    </body>
    </html>
  `;

  return html;
}

export async function POST(req) {
  try {
    const { analysisData, user } = await req.json();

    let executablePath;
    if (process.env.NODE_ENV === 'development') {
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      executablePath = await chromium.executablePath();
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
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

    const fileName = `${user.username}-vark-report-${Date.now()}.pdf`;
    const file = bucket.file(fileName);

    await file.save(pdfBuffer, {
      metadata: { contentType: 'application/pdf' },
    });

    await file.makePublic();
    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating VARK PDF:', error);
    return NextResponse.json({
      error: error.message || 'Failed to generate VARK PDF',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, {
      status: error.message.includes('timeout') ? 504 : 500
    });
  }
}