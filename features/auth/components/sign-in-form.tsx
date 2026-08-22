"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MessageCircleMore, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { login } from "@/features/auth/api/auth.api"
import { authKeys } from "@/features/auth/api/auth.keys"
import { ApiClientError } from "@/lib/api/error"
import {
  type SignInFormValues,
  signInFormSchema,
} from "../schemas/sign-in.schema"

const defaultValues: SignInFormValues = {
  phone: "",
  name: "",
}

type SignInFormProps = {
  redirectTo?: string
}

export default function SignInForm({
  redirectTo = "/messages",
}: SignInFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationKey: [...authKeys.all, "login"],
    mutationFn: login,
    onSuccess: (session) => {
      queryClient.removeQueries()
      queryClient.setQueryData(authKeys.session(), session)
      toast.add({
        title: "Welcome to FRChat",
        description: `Signed in as ${session.user.name}.`,
        type: "success",
      })
      router.replace(redirectTo)
    },
    onError: (error) => {
      toast.add({
        title: "Unable to sign in",
        description:
          error instanceof ApiClientError
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      })
    },
  })

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: signInFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value)
      } catch {
        // The mutation callback owns presentation of API errors.
      }
    },
  })

  return (
    <div>
      <form
        id="sign-in-form"
        className="space-y-5"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field
            name="phone"
            validators={{ onBlur: signInFormSchema.shape.phone }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-semibold">
                    Phone number
                  </label>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="+880 1712 345 678"
                    autoComplete="tel"
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? "phone-error" : undefined}
                    disabled={loginMutation.isPending}
                    className="h-13 rounded-xl border-border bg-background px-4 text-sm transition focus-visible:ring-primary"
                  />

                  <p className="text-xs text-muted-foreground">
                    We&apos;ll use this number to identify your account.
                  </p>

                  {isInvalid && (
                    <FieldError
                      id="phone-error"
                      errors={field.state.meta.errors}
                    />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <form.Field
            name="name"
            validators={{ onBlur: signInFormSchema.shape.name }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-semibold">
                    Your name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Enter your name"
                      autoComplete="name"
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? "name-error" : undefined}
                      disabled={loginMutation.isPending}
                      className="h-13 rounded-xl border-border bg-background px-4 pl-12"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is how others will see you.
                  </p>

                  {isInvalid && (
                    <FieldError
                      id="name-error"
                      errors={field.state.meta.errors}
                    />
                  )}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => {
            const isPending = isSubmitting || loginMutation.isPending

            return (
              <Button
                type="submit"
                disabled={!canSubmit || isPending}
                aria-busy={isPending}
                className="h-13 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
              >
                <span className="flex items-center gap-2">
                  <MessageCircleMore className="size-4" />
                  {isPending ? "Signing in..." : "Continue to Chat"}
                </span>
              </Button>
            )
          }}
        </form.Subscribe>

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
