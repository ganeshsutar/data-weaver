import { useState, FormEvent } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export function ConfirmSignUpPage() {
  const { toSignIn, user } = useAuthenticator()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const username = user?.username || ""

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await confirmSignUp({ username, confirmationCode: code })
      toSignIn()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    setError("")
    setResendMessage("")

    try {
      await resendSignUpCode({ username })
      setResendMessage("A new code has been sent to your email")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend code"
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">Cultural Pulse</span>
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {resendMessage && (
              <p className="text-sm text-muted-foreground">{resendMessage}</p>
            )}

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleResendCode}
            >
              Resend code
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Back to{" "}
            <button
              type="button"
              onClick={() => toSignIn()}
              className="text-foreground hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
