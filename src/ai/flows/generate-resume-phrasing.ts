'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating suggested phrasing for resume sections.
 *
 * It includes the `generateResumePhrasing` function to generate the resume section phrasing,
 * the `GenerateResumePhrasingInput` interface for input data,
 * and the `GenerateResumePhrasingOutput` interface for the LLM output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the resume phrasing generation flow
const GenerateResumePhrasingInputSchema = z.object({
  sectionType: z
    .string()
    .describe(
      'The type of resume section to generate phrasing for (e.g., Summary, Experience, Skills).'
    ),
  information: z
    .string()
    .describe(
      'Detailed information about the user, including education, skills, experience, and work duties, relevant to the specified section type.'
    ),
});

export type GenerateResumePhrasingInput = z.infer<
  typeof GenerateResumePhrasingInputSchema
>;

// Define the output schema for the resume phrasing generation flow
const GenerateResumePhrasingOutputSchema = z.object({
  suggestedPhrasing: z
    .string()
    .describe(
      'LLM-generated suggested phrasing for the specified resume section, tailored to the user provided information.'
    ),
});

export type GenerateResumePhrasingOutput = z.infer<
  typeof GenerateResumePhrasingOutputSchema
>;

// Define the main function that calls the resume phrasing generation flow
export async function generateResumePhrasing(
  input: GenerateResumePhrasingInput
): Promise<GenerateResumePhrasingOutput> {
  return generateResumePhrasingFlow(input);
}

// Define the prompt for generating resume phrasing
const generateResumePhrasingPrompt = ai.definePrompt({
  name: 'generateResumePhrasingPrompt',
  input: {schema: GenerateResumePhrasingInputSchema},
  output: {schema: GenerateResumePhrasingOutputSchema},
  prompt: `You are a resume writing expert. Your task is to provide suggested phrasing for the {{{sectionType}}} section of a resume, based on the information provided.

Information: {{{information}}}

Suggested Phrasing:`,
});

// Define the Genkit flow for generating resume phrasing
const generateResumePhrasingFlow = ai.defineFlow(
  {
    name: 'generateResumePhrasingFlow',
    inputSchema: GenerateResumePhrasingInputSchema,
    outputSchema: GenerateResumePhrasingOutputSchema,
  },
  async input => {
    const {output} = await generateResumePhrasingPrompt(input);
    return output!;
  }
);
