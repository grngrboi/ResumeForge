'use server';

import {
  generateResumePhrasing,
  type GenerateResumePhrasingInput,
} from '@/ai/flows/generate-resume-phrasing';

export async function suggestPhrasingAction(
  input: GenerateResumePhrasingInput
) {
  try {
    const result = await generateResumePhrasing(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating phrasing:', error);
    return {
      success: false,
      error:
        'An unexpected error occurred while generating suggestions. Please try again.',
    };
  }
}
