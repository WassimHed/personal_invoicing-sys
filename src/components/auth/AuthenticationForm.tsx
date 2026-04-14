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
import { SignupForm, SignupFormData } from './SignupForm';

interface AuthenticationFormProps {
  className?: string;
}

export function AuthenticationForm({ className }: AuthenticationFormProps) {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
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
    mutationFn: async (data: SignupFormData) => {
      let profilePictureId: number | undefined;

      // Upload profile picture if provided
      if (data.profilePicture) {
        try {
          const uploadedFile = await api.upload.uploadFile(data.profilePicture);
          profilePictureId = uploadedFile?.id;
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          // Continue with registration even if profile picture upload fails
        }
      }

      return await api.auth.signUp({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        profilePictureId,
        phone: data.phone,
        cin: data.cin,
        bio: data.bio,
        gender: data.gender,
        isPrivate: data.isPrivate
      });
    },
    onSuccess: () => {
      toast.success('Account created successfully! You can now log in.');
      setMode('login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    }
  });

  const handleSignIn = () => {
    signInMutator({ method: 'credentials', usernameOrEmail, password });
  };

  const handleSignUp = (data: SignupFormData) => {
    signUpMutator(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSignInPending) {
      handleSignIn();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignInPending) return;
    handleSignIn();
  };

  if (mode === 'signup') {
    return (
      <SignupForm
        className={className}
        onSubmit={handleSignUp}
        isPending={isSignUpPending}
        onBackToLogin={() => setMode('login')}
      />
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="grid gap-4">
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

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                router.push('?target=forgot-password');
              }}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSignInPending}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSignInPending}>
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => setMode('signup')}
          className="underline underline-offset-4 hover:text-primary transition-colors">
          Sign up
        </button>
      </div>
    </div>
  );
}