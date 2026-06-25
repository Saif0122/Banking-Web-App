"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const [tokenExists, setTokenExists] = useState<boolean>(false);

  useEffect(() => {
    // Check if token exists in cookies or localStorage
    const cookieToken = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
    const localToken = localStorage.getItem("auth_token");
    setTimeout(() => setTokenExists(!!cookieToken || !!localToken), 0);
  }, [user]);

  const handleGetCurrentUser = () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Auth Debug Panel</CardTitle>
          <CardDescription className="text-zinc-400">
            Verify the current authentication status and user details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-medium text-zinc-500 mb-1">Authentication Status</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-medium text-zinc-500 mb-1">Token Exists</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${tokenExists ? 'bg-green-500' : 'bg-red-500'}`} />
                {tokenExists ? "Yes (Cookie/Local)" : "No"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-medium text-zinc-500 mb-1">User Role</div>
              <div className="text-lg font-semibold">
                {user?.role || "N/A"}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-medium text-zinc-500 mb-1">Loading State</div>
              <div className="text-lg font-semibold">
                {isLoading ? "Loading..." : "Idle"}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
            <div className="text-sm font-medium text-zinc-500 mb-2">Current User Object</div>
            <pre className="text-xs font-mono bg-zinc-900 p-3 rounded overflow-auto max-h-40 border border-zinc-800 text-zinc-300">
              {user ? JSON.stringify(user, null, 2) : "null"}
            </pre>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-800">
            <Button 
              onClick={handleGetCurrentUser}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Refetch Current User
            </Button>
            <Button 
              onClick={() => logout()}
              variant="destructive"
              disabled={!isAuthenticated}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
