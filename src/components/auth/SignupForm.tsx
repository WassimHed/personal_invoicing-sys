import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/shared/Spinner';
import { defineStepper } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight, Check, UserCircle, ImagePlus, X } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Gender } from '@/types';

interface SignupFormProps {
  className?: string;
  onSubmit: (data: SignupFormData) => void;
  isPending: boolean;
  onBackToLogin: () => void;
}

export interface SignupFormData {
  // Step 1: Account Information
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2: Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  profilePicture?: File;

  // Step 3: Profile Information (Optional)
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
}

const { Stepper, utils } = defineStepper(
  { id: 'account', title: 'Account', description: 'Create your account' },
  { id: 'personal', title: 'Personal Info', description: 'Basic information' },
  { id: 'profile', title: 'Profile', description: 'Additional details' },
  { id: 'review', title: 'Review', description: 'Confirm your details' }
);

export const SignupForm = ({ className, onSubmit, isPending, onBackToLogin }: SignupFormProps) => {
  const [formData, setFormData] = React.useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: undefined,
    profilePicture: undefined,
    phone: '',
    cin: '',
    bio: '',
    gender: undefined,
    isPrivate: false
  });

  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Partial<Record<keyof SignupFormData, string>>>({});

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateAccountStep = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePersonalStep = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if (formData.dateOfBirth) {
      const age = new Date().getFullYear() - formData.dateOfBirth.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileStep = (): boolean => {
    // All profile fields are optional, so no validation needed
    // Just clear any existing errors for profile fields
    return true;
  };

  const handleSubmit = () => {
    if (validateAccountStep() && validatePersonalStep() && validateProfileStep()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill in your details to get started
        </p>
      </div>

      <Stepper.Provider>
        {({ methods }) => (
          <>
            {/* Stepper Navigation */}
            <Stepper.Navigation className="mb-6">
              <Stepper.Step of="account" icon={utils.getIndex(methods.current.id) > utils.getIndex('account') ? <Check className="size-4" /> : undefined}>
                <Stepper.Title>Account</Stepper.Title>
                <Stepper.Description>Create your account</Stepper.Description>
              </Stepper.Step>

              <Stepper.Step of="personal" icon={utils.getIndex(methods.current.id) > utils.getIndex('personal') ? <Check className="size-4" /> : undefined}>
                <Stepper.Title>Personal Info</Stepper.Title>
                <Stepper.Description>Basic information</Stepper.Description>
              </Stepper.Step>

              <Stepper.Step of="profile" icon={utils.getIndex(methods.current.id) > utils.getIndex('profile') ? <Check className="size-4" /> : undefined}>
                <Stepper.Title>Profile</Stepper.Title>
                <Stepper.Description>Additional details</Stepper.Description>
              </Stepper.Step>

              <Stepper.Step of="review" icon={utils.getIndex(methods.current.id) > utils.getIndex('review') ? <Check className="size-4" /> : undefined}>
                <Stepper.Title>Review</Stepper.Title>
                <Stepper.Description>Confirm your details</Stepper.Description>
              </Stepper.Step>
            </Stepper.Navigation>

            {/* Step 1: Account Information */}
            {methods.current.id === 'account' && (
              <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="john_doe"
                      value={formData.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
            )}

            {/* Step 2: Personal Information */}
            {methods.current.id === 'personal' && (
              <div className="grid gap-4">
                  {/* Profile Picture */}
                  <ProfilePictureUpload
                    profilePicture={formData.profilePicture}
                    profilePreview={profilePreview}
                    onPictureChange={(file) => {
                      updateField('profilePicture', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setProfilePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setProfilePreview(null);
                      }
                    }}
                    disabled={isPending}
                  />

                  <div className="grid gap-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      disabled={isPending}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <DatePicker
                      value={formData.dateOfBirth}
                      onChange={(date: Date) => updateField('dateOfBirth', date)}
                      isPending={isPending}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                  </div>
                </div>
            )}

            {/* Step 3: Profile Information (Optional) */}
            {methods.current.id === 'profile' && (
              <div className="grid gap-4">
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    All fields in this step are optional
                  </p>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+216 98 765 432"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cin">CIN</Label>
                    <Input
                      id="cin"
                      type="text"
                      placeholder="12345678"
                      value={formData.cin}
                      onChange={(e) => updateField('cin', e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      disabled={isPending}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender || ''}
                      onValueChange={(value) => updateField('gender', value as Gender)}
                      disabled={isPending}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={Gender.Male} id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={Gender.Female} id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="isPrivate">Private Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Hide your profile from other users
                      </p>
                    </div>
                    <Switch
                      id="isPrivate"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => updateField('isPrivate', checked)}
                      disabled={isPending}
                    />
                  </div>
                </div>
            )}

            {/* Step 4: Review */}
            {methods.current.id === 'review' && (
              <div className="grid gap-6">
                  {/* Profile Picture Preview */}
                  {profilePreview && (
                    <div className="flex justify-center">
                      <Image
                        src={profilePreview}
                        alt="Profile Preview"
                        width={100}
                        height={100}
                        className="size-25 rounded-full object-cover border-2 border-border"
                      />
                    </div>
                  )}

                  <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Account Information</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Username:</span>
                        <span className="font-medium">{formData.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      {formData.dateOfBirth && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date of Birth:</span>
                          <span className="font-medium">
                            {formData.dateOfBirth.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Information - Only show if any field is filled */}
                  {(formData.phone || formData.cin || formData.bio || formData.gender) && (
                    <div className="rounded-lg border p-4 space-y-4">
                      <h3 className="font-semibold text-lg">Profile Information</h3>
                      <div className="grid gap-2 text-sm">
                        {formData.phone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{formData.phone}</span>
                          </div>
                        )}
                        {formData.cin && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CIN:</span>
                            <span className="font-medium">{formData.cin}</span>
                          </div>
                        )}
                        {formData.gender && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gender:</span>
                            <span className="font-medium">{formData.gender}</span>
                          </div>
                        )}
                        {formData.bio && (
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground">Bio:</span>
                            <span className="font-medium text-xs">{formData.bio}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profile Visibility:</span>
                          <span className="font-medium">{formData.isPrivate ? 'Private' : 'Public'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground text-center">
                    Please review your information before creating your account.
                  </p>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => methods.prev()}
                disabled={utils.getFirst().id === methods.current.id || isPending}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {utils.getLast().id === methods.current.id ? (
                <Button type="button" onClick={handleSubmit} disabled={isPending}>
                  Create Account
                  <Spinner show={isPending} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    let isValid = false;
                    if (methods.current.id === 'account') {
                      isValid = validateAccountStep();
                    } else if (methods.current.id === 'personal') {
                      isValid = validatePersonalStep();
                    } else if (methods.current.id === 'profile') {
                      isValid = validateProfileStep();
                    }

                    if (isValid) {
                      methods.next();
                    }
                  }}
                  disabled={isPending}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </Stepper.Provider>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <button
          onClick={onBackToLogin}
          className="underline underline-offset-4 hover:text-primary transition-colors">
          Login
        </button>
      </div>
    </div>
  );
};

interface ProfilePictureUploadProps {
  profilePicture?: File;
  profilePreview: string | null;
  onPictureChange: (file: File | undefined) => void;
  disabled?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePreview,
  onPictureChange,
  disabled
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onPictureChange(acceptedFiles[0]);
      }
    },
    maxFiles: 1,
    maxSize: 2_000_000,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [], 'image/webp': [] },
    disabled
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Label className="text-center">Profile Picture (Optional)</Label>

      {profilePreview ? (
        <div className="relative">
          <Image
            src={profilePreview}
            alt="Profile Preview"
            width={120}
            height={120}
            className="size-30 rounded-full object-cover border-2 border-border"
          />
          <Button
            size="icon"
            type="button"
            variant="destructive"
            className="absolute -top-2 -right-2 size-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onPictureChange(undefined);
            }}
            disabled={disabled}>
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <div className="size-30 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
          <UserCircle className="size-16 text-muted-foreground" />
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}>
        <input {...getInputProps()} />
        <ImagePlus className="size-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-center">
          {isDragActive ? 'Drop image here' : 'Click or drag to upload'}
        </p>
        <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP — max 2MB</p>
      </div>
    </div>
  );
};

