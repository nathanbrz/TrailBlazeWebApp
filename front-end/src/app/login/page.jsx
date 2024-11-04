// app/signup/page.js

import dynamic from 'next/dynamic';

// Dynamically import the Signup component with SSR disabled
const Signup = dynamic(() => import('../components/login/login.jsx'), { ssr: false });

export default function SignupPage() {
  return <Signup />;
}