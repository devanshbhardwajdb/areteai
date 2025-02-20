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
    await page.setContent(generateHtmlReport(analysisData), { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const fileName = `${user.username}-vark-report-${Date.now()}.pdf`;
    const file = bucket.file(fileName);
    await file.save(pdfBuffer, { metadata: { contentType: 'application/pdf' } });
    await file.makePublic();
    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating VARK PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate VARK PDF' },
      { status: 500 }
    );
  }
}

function generateHtmlReport(data) {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .title { text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
      .section { margin-bottom: 40px; }
      h2 { font-size: 22px; color: #ff9800; }
    </style>
  `;

  let html = `<html><head>${styles}</head><body>`;
  html += `<div class="title">VARK Learning Style Report</div>`;

  data.learningStyles.forEach((style) => {
    html += `<div class="section"><h2>${style.type}</h2><p>${style.description}</p></div>`;
  });

  html += `<h2>Overall Summary</h2>
  <p><strong>Strengths:</strong> ${data.overall.strengths}</p>
  <p><strong>Weaknesses:</strong> ${data.overall.weaknesses}</p>
  <p><strong>Recommended Study Methods:</strong> ${data.overall.recommendedStudyMethods}</p>
  </body></html>`;

  return html;
}
