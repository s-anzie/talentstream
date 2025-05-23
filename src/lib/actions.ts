
"use server";

import { suggestJobCategories as suggestJobCategoriesFlow, SuggestJobCategoriesInput, SuggestJobCategoriesOutput } from "@/ai/flows/suggest-job-categories";
import { parseResume as parseResumeFlow, ParseResumeInput as GenkitParseResumeInput, ParseResumeOutput as GenkitParseResumeOutput } from "@/ai/flows/parse-resume-flow"; // Added
import { JobApplicationFormData, ProfileFormData, JobPostingFormData, AddCandidateFormData, InviteTeamMemberFormData, ParseResumeInput } from "./types"; 

export async function suggestCategoriesAction(
  data: SuggestJobCategoriesInput
): Promise<SuggestJobCategoriesOutput | { error: string }> {
  try {
    const result = await suggestJobCategoriesFlow(data);
    return result;
  } catch (error) {
    console.error("Error in suggestCategoriesAction:", error);
    return { error: "Failed to suggest categories. Please try again." };
  }
}

export async function submitApplicationAction(jobId: string, data: JobApplicationFormData) {
  console.log("Submitting application for job ID:", jobId, data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `Successfully applied for job ${jobId} as ${data.name}` };
}

export async function saveProfileDataAction(data: ProfileFormData) {
  console.log("Saving profile data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Profile updated successfully!" };
}

export async function createJobPostingAction(data: JobPostingFormData) {
  console.log("Creating job posting with data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `Offre d'emploi "${data.jobTitle}" créée avec succès !` };
}

export async function updateJobPostingAction(jobId: string, data: JobPostingFormData) {
  console.log("Updating job posting with ID:", jobId, "and data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `Offre d'emploi "${data.jobTitle}" (ID: ${jobId}) mise à jour avec succès !` };
}

export async function addCandidateAction(data: AddCandidateFormData) {
  console.log("Adding new candidate with data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `Candidat ${data.fullName} ajouté avec succès.` };
}

export async function inviteTeamMemberAction(data: InviteTeamMemberFormData) {
  console.log("Inviting new team member:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `Invitation envoyée à ${data.email} avec le rôle ${data.role}.` };
}

// Action to call the resume parsing Genkit flow
export async function parseResumeAction(
  data: GenkitParseResumeInput
): Promise<GenkitParseResumeOutput | { error: string }> {
  try {
    // Ensure the input data matches what the Genkit flow expects
    // The 'data' parameter should already be of type GenkitParseResumeInput if called correctly from the client
    const result = await parseResumeFlow(data);
    return result;
  } catch (error: any) {
    console.error("Error in parseResumeAction:", error);
    // Try to provide a more specific error message if available
    const errorMessage = error.message || "Failed to parse resume. Please ensure the file is valid and try again.";
    return { error: errorMessage };
  }
}
