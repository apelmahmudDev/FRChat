"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowRight,
  LoaderCircle,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
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
      onChange: signInFormSchema,
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
    <div className="w-full max-w-[420px]">
      <div className="mb-7">
        <p className="text-xs font-extrabold tracking-[0.16em] text-[#0a8f55] uppercase dark:text-[#60d78d]">
          Welcome to FRChat
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-[-0.045em] text-[#14251d] sm:text-4xl dark:text-[#eef8f1]">
          Continue your conversation.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#68776f] dark:text-[#9cada3]">
          Enter your phone number and name. We&apos;ll sign you in or create
          your account automatically.
        </p>
      </div>

      <form
        id="sign-in-form"
        className="space-y-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <FieldGroup className="gap-5">
          <form.Field name="phone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-bold text-[#263b31] dark:text-[#dce9e1]"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#819087] dark:text-[#82958a]" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="+880 1712 345 678"
                      autoComplete="tel"
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? "phone-error" : undefined}
                      disabled={loginMutation.isPending}
                      className="h-12 rounded-xl border-[#173a2a]/12 bg-[#fafbf8] pr-4 pl-11 text-sm transition focus-visible:border-[#0a8f55]/45 focus-visible:ring-2 focus-visible:ring-[#0a8f55]/12 aria-invalid:ring-2 aria-invalid:ring-destructive/15 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>

                  <p className="text-[11px] leading-5 text-[#78877f] dark:text-[#84968c]">
                    We&apos;ll use this number to identify your account.
                  </p>

                  {isInvalid && (
                    <FieldError
                      id="phone-error"
                      errors={field.state.meta.errors}
                      className="text-xs leading-5"
                    />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-bold text-[#263b31] dark:text-[#dce9e1]"
                  >
                    Your name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#819087] dark:text-[#82958a]" />
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
                      className="h-12 rounded-xl border-[#173a2a]/12 bg-[#fafbf8] pr-4 pl-11 text-sm transition focus-visible:border-[#0a8f55]/45 focus-visible:ring-2 focus-visible:ring-[#0a8f55]/12 aria-invalid:ring-2 aria-invalid:ring-destructive/15 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>

                  <p className="text-[11px] leading-5 text-[#78877f] dark:text-[#84968c]">
                    This is how others will see you.
                  </p>

                  {isInvalid && (
                    <FieldError
                      id="name-error"
                      errors={field.state.meta.errors}
                      className="text-xs leading-5"
                    />
                  )}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isPristine,
          ]}
        >
          {([canSubmit, isSubmitting, isPristine]) => {
            const isPending = isSubmitting || loginMutation.isPending

            return (
              <Button
                type="submit"
                disabled={isPristine || !canSubmit || isPending}
                aria-busy={isPending}
                className="group h-12 w-full rounded-xl bg-[#0a8f55] px-5 font-bold text-white shadow-sm transition hover:bg-[#087a49] focus-visible:ring-[#0a8f55]/25"
              >
                {isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                {isPending ? "Signing in..." : "Continue to chat"}
                {!isPending && (
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            )
          }}
        </form.Subscribe>

        <div className="flex items-start gap-3 rounded-2xl border border-[#173a2a]/9 bg-[#f7faf6] p-4 dark:border-white/8 dark:bg-white/4">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#dff3e7] text-[#0a8f55] dark:bg-[#183b29] dark:text-[#70d99a]">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#263b31] dark:text-[#dce9e1]">
              No separate sign-up
            </p>
            <p className="mt-1 text-xs leading-5 text-[#718078] dark:text-[#91a198]">
              A new phone number creates your account automatically, and your
              session stays protected.
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] leading-5 text-[#849189] dark:text-[#7f9187]">
          By continuing, you agree to FRChat&apos;s Terms of Service and Privacy
          Policy.
        </p>
      </form>
    </div>
  )
}
