"use client"

import LoaderUI from "@/components/LoaderUi";
import { useUserRole } from "@/hooks/useUserRole";

import InterviewerScheduleUI from "./InterviewerScheduleUI";
import { useRouter } from "next/navigation";

const Schedule = () => {
  const router = useRouter();
  const { isInterviewer,isLoading} = useUserRole();

  if ( isLoading) return <LoaderUI />
  if(!isInterviewer) return router.push('/');

  return (
   <InterviewerScheduleUI />
  )
}

export default Schedule
