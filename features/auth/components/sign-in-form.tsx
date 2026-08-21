"use client"

import { useForm } from "@tanstack/react-form"
import { MessageCircleMore, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type SignInFormValues,
  signInFormSchema,
} from "../schemas/sign-in.schema"

export default function SignInForm() {
  const form = useForm({
    defaultValues: {
      phone: "",
      name: "",
    } satisfies SignInFormValues,
    validators: {
      onSubmit: signInFormSchema,
    },
    onSubmit: async () => {},
  })

  return (
    <div>
      <form
        id="sign-in-form"
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name="phone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              const value = field.state.value as SignInFormValues["phone"]

              return (
                <Field data-invalid={isInvalid} className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-semibold">
                    Phone number
                  </label>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+880 1712 345 678"
                    autoComplete="tel"
                    aria-invalid={isInvalid}
                    className="h-13 rounded-xl border-border bg-background px-4 text-sm transition focus-visible:ring-primary"
                  />

                  <p className="text-xs text-muted-foreground">
                    We&apos;ll use this number to identify your account.
                  </p>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              const value = field.state.value as SignInFormValues["name"]

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
                      value={value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      aria-invalid={isInvalid}
                      className="h-13 rounded-xl border-border bg-background px-4 pl-12"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is how others will see you.
                  </p>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Button
          type="submit"
          form="sign-in-form"
          className="h-13 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
        >
          <span className="flex items-center gap-2">
            <MessageCircleMore className="size-4" />
            Continue to Chat
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
