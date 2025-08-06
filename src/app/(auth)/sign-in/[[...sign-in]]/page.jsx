import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
        <SignIn fallbackRedirectUrl="https://ai-pdfnotetaker.onrender.com/dashboard"
  forceRedirectUrl="https://ai-pdfnotetaker.onrender.com/dashboard" />
    </div>
)
}
