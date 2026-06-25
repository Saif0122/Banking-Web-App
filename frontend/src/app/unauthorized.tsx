import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
        <div className="mx-auto w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-orange-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have the required permissions or roles to view this page. Please contact your administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
          <Link href="/login" className={buttonVariants({ size: "lg", className: "gap-2" })}>
            <LogIn className="w-4 h-4" />
            Sign In Again
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}>
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
