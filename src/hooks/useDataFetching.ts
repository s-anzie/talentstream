
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as mockApi from '@/lib/mock-api-services';
import type {
  PublicJob, Company, BlogPost, FAQItem, CandidateApplication, SavedJob, DashboardJob,
  CompanyCandidate, TeamMember, BillingInfo, Invoice, PaymentMethod, ProfileFormData,
  BlogCategory, CompanyApplication as DashboardCompanyApplication, UserConversation, UserMessage, UserNotification,
  AnalyticsOverviewData, JobPostingFormData, CompanyProfileSettings, CompanyNotificationPreferences,
  UserAccountSettings, UserNotificationSettings, UserPrivacySettings, PortfolioItem, PortfolioItemFormData,
  Certification, CertificationFormData, Referral, ReferralRequestFormData, Interview, ScheduleInterviewFormData,
  CalendarEvent
} from '@/lib/types';

// Define FetchState without setData
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// Define what the hook returns
interface UseFetchResult<T> extends FetchState<T> {
  setData: (newDataOrFn: T | null | ((prevState: T | null) => T | null)) => void;
  refetch: () => Promise<void>;
}

// Generic fetch hook
const useGenericFetch = <T, P = void>(
  fetchFunction: (params: P) => Promise<T | null>,
  params: P,
  autoFetch = true,
  initialData: T | null = null
): UseFetchResult<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    isLoading: autoFetch && !initialData, // Initial loading state determination
    error: null,
  });

  const fetchFunctionRef = React.useRef(fetchFunction);
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  const fetchData = useCallback(async (currentParams: P) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await fetchFunctionRef.current(currentParams);
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState(prev => ({ ...prev, data: null, isLoading: false, error: err as Error }));
    }
  }, []); // fetchData is stable.

  const stringifiedParams = useMemo(() => {
    if (typeof params === 'object' && params !== null) {
      try {
        if (Array.isArray(params)) {
            return JSON.stringify(params);
        }
        // Ensure consistent key order for objects for more stable stringify
        const sortedParams = Object.keys(params as object).sort().reduce((obj, key) => {
            (obj as any)[key] = (params as any)[key];
            return obj;
        }, {} as P);
        return JSON.stringify(sortedParams);
      } catch (e) {
        console.warn("useGenericFetch: Params object is not serializable, using object reference for dependency.", params);
        return params;
      }
    }
    return params; // For primitive params
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchData(params); // Use params from the current render cycle
    }
  }, [fetchData, autoFetch, stringifiedParams]); // Removed raw 'params' from dependencies

  const customSetData = useCallback((newDataOrFn: T | null | ((prevState: T | null) => T | null)) => {
    setState(prev => ({
      ...prev,
      data: typeof newDataOrFn === 'function'
        ? (newDataOrFn as (prevState: T | null) => T | null)(prev.data)
        : newDataOrFn,
    }));
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    setData: customSetData,
    refetch: () => fetchData(params),
  };
};


// --- Public Data Hooks ---
export const useFetchPublicJobs = () => useGenericFetch<PublicJob[], void>(mockApi.fetchPublicJobs, undefined);
export const useFetchPublicJobDetails = (jobId: string | null) =>
  useGenericFetch<PublicJob | null, string | null>(
    (id) => id ? mockApi.fetchPublicJobDetails(id) : Promise.resolve(null),
    jobId,
    !!jobId
  );

export const useFetchCompanies = () => useGenericFetch<Company[], void>(mockApi.fetchCompanies, undefined);
export const useFetchCompanyDetails = (companyId: string | null) =>
  useGenericFetch<Company | null, string | null>(
    (id) => id ? mockApi.fetchCompanyDetails(id) : Promise.resolve(null),
    companyId,
    !!companyId
  );

export const useFetchBlogPosts = () => useGenericFetch<BlogPost[], void>(mockApi.fetchBlogPosts, undefined);
export const useFetchBlogPostDetails = (slug: string | null) =>
  useGenericFetch<BlogPost | null, string | null>(
    (s) => s ? mockApi.fetchBlogPostDetails(s) : Promise.resolve(null),
    slug,
    !!slug
  );
export const useFetchBlogCategories = () => useGenericFetch<BlogCategory[], void>(mockApi.fetchBlogCategories, undefined);
export const useFetchFaqItems = () => useGenericFetch<FAQItem[], void>(mockApi.fetchFaqItems, undefined);


// --- User/Candidate Hooks ---
export const useFetchUserProfile = (userId: string | null) =>
  useGenericFetch<ProfileFormData | null, string | null>(
    (id) => id ? mockApi.fetchUserProfileData(id) : Promise.resolve(null),
    userId,
    !!userId
  );
export const useFetchCandidateApplications = (candidateId: string | null) =>
  useGenericFetch<CandidateApplication[], string | null>(
    (id) => id ? mockApi.fetchCandidateApplications(id) : Promise.resolve([]),
    candidateId,
    !!candidateId
  );

export const useFetchCandidateApplicationDetails = (applicationId: string | null) =>
    useGenericFetch<CandidateApplication | null, string | null>(
    (id) => id ? mockApi.fetchCandidateApplicationDetails(id) : Promise.resolve(null),
    applicationId,
    !!applicationId
);

export const useFetchSavedJobs = (candidateId: string | null) =>
  useGenericFetch<SavedJob[], string | null>(
    (id) => id ? mockApi.fetchSavedJobs(id) : Promise.resolve([]),
    candidateId,
    !!candidateId
  );

// --- Dashboard/Company Hooks ---
export const useFetchDashboardJobs = (companyId: string | null) =>
  useGenericFetch<DashboardJob[], string | null>(
    (id) => id ? mockApi.fetchDashboardJobs(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );

export const useFetchDashboardJobDetails = (jobId: string | null) =>
  useGenericFetch<(JobPostingFormData & {id: string, companyId: string, status: string, views: number, applications: number, datePosted: string, pipelineStats?: any, company?:{id:string, name:string, logoUrl?:string} }) | null, string | null>(
    (id) => id ? mockApi.fetchDashboardJobDetails(id) : Promise.resolve(null),
    jobId,
    !!jobId
  );

export const useFetchJobCandidates = (jobId: string | null) =>
  useGenericFetch<CompanyCandidate[], string | null>(
    (id) => id ? mockApi.fetchJobCandidates(id) : Promise.resolve([]),
    jobId,
    !!jobId
  );

export const useFetchAllCompanyCandidates = (companyId: string | null) =>
  useGenericFetch<CompanyCandidate[], string | null>(
    (id) => id ? mockApi.fetchAllCompanyCandidates(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );
export const useFetchCompanyCandidateDetails = (candidateId: string | null) =>
  useGenericFetch<CompanyCandidate | null, string | null>(
    (id) => id ? mockApi.fetchCompanyCandidateDetails(id) : Promise.resolve(null),
    candidateId,
    !!candidateId
  );

export const useFetchTeamMembers = (companyId: string | null) =>
  useGenericFetch<TeamMember[], string | null>(
    (id) => id ? mockApi.fetchTeamMembers(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );
export const useFetchTeamMemberDetails = (memberId: string | null) =>
  useGenericFetch<TeamMember | null, string | null>(
    (id) => id ? mockApi.fetchTeamMemberDetails(id) : Promise.resolve(null),
    memberId,
    !!memberId
  );

export const useFetchBillingInfo = (companyId: string | null) =>
  useGenericFetch<BillingInfo | null, string | null>(
    (id) => id ? mockApi.fetchBillingInfo(id) : Promise.resolve(null),
    companyId,
    !!companyId
  );
export const useFetchInvoices = (companyId: string | null) =>
  useGenericFetch<Invoice[], string | null>(
    (id) => id ? mockApi.fetchInvoices(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );
export const useFetchInvoiceDetails = (invoiceId: string | null) =>
  useGenericFetch<Invoice | null, string | null>(
    (id) => id ? mockApi.fetchInvoiceDetails(id) : Promise.resolve(null),
    invoiceId,
    !!invoiceId
  );

export const useFetchCompanyApplications = (companyId: string | null) => // For dashboard listing
  useGenericFetch<DashboardCompanyApplication[], string | null>(
    (id) => id ? mockApi.fetchCompanyApplications(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );

export const useFetchCompanyApplicationDetails = (applicationId: string | null) => // For dashboard viewing one
  useGenericFetch<DashboardCompanyApplication | null, string | null>(
    (id) => id ? mockApi.fetchCompanyApplicationDetails(id) : Promise.resolve(null),
    applicationId,
    !!applicationId
  );

// --- Messaging & Notifications Hooks ---
export const useFetchUserConversations = (userId: string | null) =>
  useGenericFetch<UserConversation[], string | null>(
    (id) => id ? mockApi.fetchUserConversations(id) : Promise.resolve([]),
    userId,
    !!userId
  );
export const useFetchUserConversationDetails = (conversationId: string | null) =>
  useGenericFetch<UserConversation | null, string | null>(
    (id) => id ? mockApi.fetchUserConversationDetails(id) : Promise.resolve(null),
    conversationId,
    !!conversationId
  );

export const useFetchUserMessages = (conversationId: string | null) =>
  useGenericFetch<UserMessage[], string | null>(
    (id) => id ? mockApi.fetchUserMessages(id) : Promise.resolve([]),
    conversationId,
    !!conversationId
  );

export const useFetchUserNotifications = (userId: string | null) =>
  useGenericFetch<UserNotification[], string | null>(
    (id) => id ? mockApi.fetchUserNotifications(id) : Promise.resolve([]),
    userId,
    !!userId
  );

// --- Analytics Hooks ---
export const useFetchAnalyticsOverviewData = (companyId: string | null) =>
  useGenericFetch<AnalyticsOverviewData | null, string | null>(
    (id) => id ? mockApi.fetchAnalyticsOverviewData(id) : Promise.resolve(null),
    companyId,
    !!companyId
  );

// --- Settings Hooks ---
export const useFetchCompanyProfileSettings = (companyId: string | null) =>
  useGenericFetch<CompanyProfileSettings | null, string | null>(
    (id) => id ? mockApi.fetchCompanyProfileSettings(id) : Promise.resolve(null),
    companyId,
    !!companyId
  );
export const useFetchCompanyNotificationPreferences = (companyId: string | null) =>
  useGenericFetch<CompanyNotificationPreferences | null, string | null>(
    (id) => id ? mockApi.fetchCompanyNotificationPreferences(id) : Promise.resolve(null),
    companyId,
    !!companyId
  );
export const useFetchTeamMemberPermissions = (memberId: string | null) =>
    useGenericFetch<Record<string, boolean> | null, string | null>(
    (id) => id ? mockApi.fetchTeamMemberPermissions(id) : Promise.resolve(null),
    memberId,
    !!memberId
);

export const useFetchUserAccountSettings = (userId: string | null) =>
  useGenericFetch<UserAccountSettings | null, string | null>(
    (id) => id ? mockApi.fetchUserAccountSettings(id) : Promise.resolve(null),
    userId,
    !!userId
  );
export const useFetchUserNotificationSettings = (userId: string | null) =>
  useGenericFetch<UserNotificationSettings | null, string | null>(
    (id) => id ? mockApi.fetchUserNotificationSettings(id) : Promise.resolve(null),
    userId,
    !!userId
  );
export const useFetchUserPrivacySettings = (userId: string | null) =>
  useGenericFetch<UserPrivacySettings | null, string | null>(
    (id) => id ? mockApi.fetchUserPrivacySettings(id) : Promise.resolve(null),
    userId,
    !!userId
  );

// --- Portfolio Hooks ---
export const useFetchUserPortfolioItems = (userId: string | null) =>
  useGenericFetch<PortfolioItem[], string | null>(
    (id) => id ? mockApi.fetchUserPortfolioItems(id) : Promise.resolve([]),
    userId,
    !!userId
  );
export const useFetchUserPortfolioItemDetails = (itemId: string | null) =>
  useGenericFetch<PortfolioItem | null, string | null>(
    (id) => id ? mockApi.fetchUserPortfolioItemDetails(id) : Promise.resolve(null),
    itemId,
    !!itemId
  );

// --- Certifications Hooks ---
export const useFetchUserCertifications = (userId: string | null) =>
  useGenericFetch<Certification[], string | null>(
    (id) => id ? mockApi.fetchUserCertifications(id) : Promise.resolve([]),
    userId,
    !!userId
  );
export const useFetchUserCertificationDetails = (certId: string | null) =>
  useGenericFetch<Certification | null, string | null>(
    (id) => id ? mockApi.fetchUserCertificationDetails(id) : Promise.resolve(null),
    certId,
    !!certId
  );

// --- Referrals Hooks ---
export const useFetchUserReferrals = (userId: string | null) =>
  useGenericFetch<Referral[], string | null>(
    (id) => id ? mockApi.fetchUserReferrals(id) : Promise.resolve([]),
    userId,
    !!userId
  );

// --- Interview Hooks ---
export const useFetchDashboardInterviews = (companyId: string | null) =>
  useGenericFetch<Interview[], string | null>(
    (id) => id ? mockApi.fetchDashboardInterviews(id) : Promise.resolve([]),
    companyId,
    !!companyId
  );
export const useFetchDashboardInterviewDetails = (interviewId: string | null) =>
  useGenericFetch<Interview | null, string | null>(
    (id) => id ? mockApi.fetchDashboardInterviewDetails(id) : Promise.resolve(null),
    interviewId,
    !!interviewId
  );
export const useFetchUserInterviews = (userId: string | null) =>
  useGenericFetch<Interview[], string | null>(
    (id) => id ? mockApi.fetchUserInterviews(id) : Promise.resolve([]),
    userId,
    !!userId
  );
export const useFetchUserInterviewDetails = (interviewId: string | null) =>
  useGenericFetch<Interview | null, string | null>(
    (id) => id ? mockApi.fetchUserInterviewDetails(id) : Promise.resolve(null),
    interviewId,
    !!interviewId
  );

// --- Calendar Hooks ---
interface CalendarFetchParams {
  userIdOrCompanyId: string | null;
  rangeStart: Date;
  rangeEnd: Date;
}

export const useFetchCalendarEvents = (userIdOrCompanyId: string | null, rangeStart: Date, rangeEnd: Date) => {
    const params = useMemo(() => ({ userIdOrCompanyId, rangeStart, rangeEnd }), [userIdOrCompanyId, rangeStart, rangeEnd]);
    return useGenericFetch<CalendarEvent[], CalendarFetchParams>(
        (p) => p.userIdOrCompanyId ? mockApi.fetchCalendarEvents(p.userIdOrCompanyId, p.rangeStart, p.rangeEnd) : Promise.resolve([]),
        params,
        !!params.userIdOrCompanyId
    );
};

// Re-export commonly used services for convenience if needed directly in components
export * as mockApiServices from '@/lib/mock-api-services';
// Ensure there is no unparsed text after this line // Example of ensuring nothing follows
