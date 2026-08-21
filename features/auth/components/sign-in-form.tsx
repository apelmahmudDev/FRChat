"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { MessageCircleMore, User } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type SignInFormValues,
  signInFormSchema,
} from "../schemas/sign-in.schema"

const defaultValues: SignInFormValues = {
  phone: "",
  name: "",
}

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues,
    mode: "onTouched",
  })

  const onSubmit = () => {}

  return (
    <div>
      <form
        id="sign-in-form"
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={Boolean(errors.phone)} className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone number
            </label>

            <Input
              id="phone"
              type="tel"
              placeholder="+880 1712 345 678"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              disabled={isSubmitting}
              className="h-13 rounded-xl border-border bg-background px-4 text-sm transition focus-visible:ring-primary"
              {...register("phone")}
            />

            <p className="text-xs text-muted-foreground">
              We&apos;ll use this number to identify your account.
            </p>

            {errors.phone && (
              <FieldError id="phone-error" errors={[errors.phone]} />
            )}
          </Field>

          <Field data-invalid={Boolean(errors.name)} className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold">
              Your name
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={isSubmitting}
                className="h-13 rounded-xl border-border bg-background px-4 pl-12"
                {...register("name")}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              This is how others will see you.
            </p>

            {errors.name && (
              <FieldError id="name-error" errors={[errors.name]} />
            )}
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-13 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
        >
          <span className="flex items-center gap-2">
            <MessageCircleMore className="size-4" />
            {isSubmitting ? "Continuing..." : "Continue to Chat"}
          </span>
        </Button>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold">New here? Don&apos;t worry!</p>
          <p className="mt-1 text-xs text-muted-foreground">
            If your number is new, we&apos;ll create an account for you.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="text-primary">Terms of Service</span> and{" "}
          <span className="text-primary">Privacy Policy</span>
        </p>
      </form>
    </div>
  )
}
