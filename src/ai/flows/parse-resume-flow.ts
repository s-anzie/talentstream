
'use server';
/**
 * @fileOverview AI-powered resume parsing flow.
 *
 * - parseResume - A function that parses resume content and extracts structured information.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ParseResumeInputSchema, ParseResumeOutputSchema } from '@/lib/types'; // Import from lib/types

export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeGenkitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Your task is to analyze the provided resume content and extract key information into a structured JSON format according to the provided output schema.

Resume Content (provided as a data URI):
{{media url=resumeDataUri}}

Please extract the following fields if present:
- fullName: The full name of the candidate.
- email: The candidate's primary email address.
- phone: The candidate's primary phone number.
- location: The candidate's general location (e.g., City, Country).
- linkedinUrl: URL to the candidate's LinkedIn profile.
- githubUrl: URL to the candidate's GitHub profile.
- portfolioUrl: URL to the candidate's personal portfolio or website.
- summary: A brief professional summary or objective statement.
- skills: An array of skills listed in the resume. Try to identify distinct skills.
- experience: An array of professional experiences, each with:
    - title: Job title or role.
    - company: Company name.
    - dates: Employment dates (e.g., 'Jan 2020 - Present' or '2018 - 2019').
    - description: Brief description of responsibilities and achievements.
- education: An array of educational qualifications, each with:
    - degree: Degree or qualification obtained.
    - institution: Name of the educational institution.
    - dates: Graduation date or period of study.
- otherInformation: Any other relevant information that doesn't fit into the above categories.

If a field is not found in the resume, omit it or provide a null/empty value as appropriate for the schema. Ensure the output strictly adheres to the JSON schema.
For arrays like skills, experience, and education, if no relevant information is found, an empty array is acceptable.
`,
});

const parseResumeGenkitFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return any output for resume parsing.");
    }
    return output;
  }
);
