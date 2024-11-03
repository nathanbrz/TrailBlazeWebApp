"use client";  // Add this line to ensure this component is client-side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(PageComponent) {
  return function AuthenticatedPage(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const uid = localStorage.getItem("uuid");
      if (!uid) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) {
      return <div>Loading...</div>;  // Placeholder while redirecting
    }

    return <PageComponent {...props} />;
  };
}