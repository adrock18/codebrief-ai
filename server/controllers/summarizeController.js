// server/controllers/summarizeController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const scrapeGitHubPR = async (url) => {
    try {
        const { data } = await axios.get(url, { headers: { 'Accept': 'text/html' } });
        const $ = cheerio.load(data);
        const title = $('#partial-discussion-header .gh-header-title').text().trim();
        const author = $('.pull-discussion-header .author').first().text().trim();
        const description = $('.comment-body').first().text().trim();
        if (!title) return "Could not scrape the URL. The page structure might have changed or it's not a valid PR.";
        return `GitHub Pull Request Summary Request. Title: "${title}" by <span class="math-inline">\{author\}\. Description\: "</span>{description}"`;
    } catch (error) {
        console.error("Scraping failed:", error.message);
        return "Failed to scrape the provided URL.";
    }
};

exports.generateSummary = async (req, res) => {
    const { inputType, content } = req.body;
    if (!inputType || !content) {
        return res.status(400).json({ message: 'inputType and content are required.' });
    }
    let textToSummarize = '';
    try {
        if (inputType === 'url') {
            if (content.includes('github.com') && content.includes('/pull/')) {
                textToSummarize = await scrapeGitHubPR(content);
            } else {
                return res.status(400).json({ message: 'URL type not supported. Please provide a GitHub Pull Request URL.' });
            }
        } else {
            textToSummarize = content;
        }
        if (textToSummarize.includes("Failed to scrape") || textToSummarize.includes("Could not scrape")) {
            return res.status(400).json({ message: textToSummarize });
        }
        const prompt = `You are "CodeBrief AI". Your task is to provide a concise, professional summary of the following technical content. Structure your output clearly.
        1.  **Summary:** Provide a brief, one-paragraph overview.
        2.  **Key Points:** Use a bulleted list to highlight the most important changes, decisions, or topics.
        3.  **Action Items:** If any clear actions are required or suggested, list them here. If none, state "No clear action items."

        Here is the content: "${textToSummarize}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        res.json({ success: true, summary });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ success: false, message: 'Failed to generate summary from AI model.' });
    }
};