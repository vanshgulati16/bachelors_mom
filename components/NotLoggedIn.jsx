import React from 'react';
import { signIn } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const NotLoggedInComponent = () => {
  const handleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Alert variant="destructive" className="mb-4 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Oopsyy!</AlertTitle>
        <AlertDescription>You are not logged in.</AlertDescription>
      </Alert>
      <Button onClick={handleLogin} variant="default">
        Login with Google
      </Button>
    </div>
  );
};

export default NotLoggedInComponent;