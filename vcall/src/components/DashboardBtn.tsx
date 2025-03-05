"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <Button
        className="gap-2 font-medium bg-green-500 text-black hover:bg-green-600 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 transition-colors duration-200"
        size={"sm"}
      >
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DasboardBtn;