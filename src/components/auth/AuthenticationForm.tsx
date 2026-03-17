import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';

interface AuthenticationFormProps {
  className?: string;
}

export function AuthenticationForm({ className }: AuthenticationFormProps) {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const { mutate: signInMutator, isPending: isSignInPending } = useMutation({
    mutationFn: async (data: {
      method: 'credentials';
      usernameOrEmail?: string;
      password?: string;
    }) => {
      const result = await signIn(data.method, {
        redirect: false,
        callbackUrl: '/',
        ...(data.method === 'credentials' && {
          usernameOrEmail: data.usernameOrEmail,
          password: data.password
        })
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      router.push('/');
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred');
    }
  });

  const { mutate: signUpMutator, isPending: isSignUpPending } = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      return await api.auth.signUp(data);
    },
    onSuccess: () => {
      toast.success('Account created successfully! You can now log in.');
      setMode('login');
      setUsernameOrEmail(email);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    }
  });

  const handleSignIn = () => {
    signInMutator({ method: 'credentials', usernameOrEmail, password });
  };

  const handleSignUp = () => {
    signUpMutator({ username, email, password });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSignInPending && !isSignUpPending) {
      if (mode === 'login') {
        handleSignIn();
      } else {
        handleSignUp();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignInPending || isSignUpPending) return;
    if (mode === 'login') {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {mode === 'login' ? 'Login to your account' : 'Create an account'}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {mode === 'login'
            ? 'Enter your email below to login to your account'
            : 'Enter your details below to create your account'}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid gap-4">
        {mode === 'login' ? (
          <div className="grid gap-2">
            <Label htmlFor="email">Email/Username</Label>
            <Input
              id="email"
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSignInPending}
            />
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="signup-username">Username</Label>
              <Input
                id="signup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSignUpPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSignUpPending}
              />
            </div>
          </>
        )}

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSignInPending || isSignUpPending}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSignInPending || isSignUpPending}>
          {mode === 'login' ? 'Login' : 'Sign up'}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </form>

      <div className="text-center text-sm">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="underline underline-offset-4 hover:text-primary transition-colors">
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="underline underline-offset-4 hover:text-primary transition-colors">
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}