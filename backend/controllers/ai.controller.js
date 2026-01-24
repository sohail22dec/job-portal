import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/v1/ai/generate-job-description - Generate job description using AI
export const generateJobDescription = asyncHandler(async (req, res) => {
    const { jobTitle, experienceLevel, skills, companyDescription } = req.body;

    // Validation
    if (!jobTitle || !experienceLevel || !skills || skills.length === 0) {
        res.status(400);
        throw new Error('Please provide job title, experience level, and at least one skill');
    }

    try {
        // Get the Gemini 1.5 Flash model (free tier)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Create the prompt
        const prompt = `You are an expert HR professional. Generate a professional job description based on the following information:

Job Title: ${jobTitle}
Experience Required: ${experienceLevel}
Key Skills: ${skills.join(', ')}
${companyDescription ? `Company: ${companyDescription}` : ''}

Please generate:
1. A compelling and professional job description (2-3 paragraphs, about 150-200 words)
2. A list of 6-8 specific job requirements

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "description": "The full job description here...",
  "requirements": ["Requirement 1", "Requirement 2", "Requirement 3", ...]
}`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse the JSON response
        // Remove markdown code blocks if present
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const generatedData = JSON.parse(cleanedText);

        // Validate the response structure
        if (!generatedData.description || !generatedData.requirements || !Array.isArray(generatedData.requirements)) {
            res.status(500);
            throw new Error('Invalid response format from AI');
        }

        res.status(200).json({
            success: true,
            data: {
                jobTitle: jobTitle,  // Return the job title user provided
                description: generatedData.description,
                requirements: generatedData.requirements
            }
        });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to generate job description. Please try again.');
    }
});

// POST /api/v1/ai/generate-cover-letter - Generate cover letter using AI
export const generateCoverLetter = asyncHandler(async (req, res) => {
    const { jobTitle, companyName, jobDescription, userSkills, userExperience } = req.body;

    // Validation
    if (!jobTitle || !companyName) {
        res.status(400);
        throw new Error('Please provide job title and company name');
    }

    try {
        // Get the Gemini 1.5 Flash model (free tier)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Create the prompt
        const prompt = `You are an expert career counselor helping a job seeker write a professional cover letter.

Generate a personalized cover letter for the following job application:

Job Title: ${jobTitle}
Company Name: ${companyName}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
${userSkills ? `Applicant's Key Skills: ${userSkills}` : ''}
${userExperience ? `Applicant's Experience: ${userExperience}` : ''}

Please generate a professional, compelling cover letter (200-300 words) that:
1. Shows enthusiasm for the role and company
2. Highlights relevant skills and experience
3. Explains why they're a great fit
4. Has a strong opening and closing
5. Sounds natural and personalized (not generic)

IMPORTANT: Respond ONLY with the cover letter text. DO NOT include "Dear Hiring Manager" or salutation. Just start with the body paragraphs. DO NOT include signature or "Sincerely" at the end.`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const coverLetter = response.text().trim();

        // Validate response
        if (!coverLetter || coverLetter.length < 50) {
            res.status(500);
            throw new Error('Invalid response from AI');
        }

        res.status(200).json({
            success: true,
            data: {
                coverLetter: coverLetter
            }
        });

    } catch (error) {
        console.error('AI Cover Letter Generation Error:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to generate cover letter. Please try again.');
    }
});
