import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        <div className="relative">
          <h1 className="text-[150px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary/80 to-primary/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-background rounded-full border border-border/50 flex items-center justify-center shadow-xl">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Page not found</h2>
          <p className="text-muted-foreground text-lg">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <Link href="/" className={buttonVariants({ size: "lg", className: "gap-2 w-full sm:w-auto" })}>
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2 w-full sm:w-auto" })}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
