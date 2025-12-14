import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react"
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthPages } from "@/components/auth/AuthPages"
import { OverviewPage } from "@/pages/OverviewPage"
import { MusicPage } from "@/pages/MusicPage"
import { NewsPage } from "@/pages/NewsPage"
import { EventsPage } from "@/pages/EventsPage"
import { fetchUserAttributes } from "aws-amplify/auth"
import { useEffect, useState } from "react"

function AuthenticatedLayout() {
  // Get user data directly from the hook to ensure we have the latest data
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const [email, setEmail] = useState<string | undefined>(
    user?.signInDetails?.loginId || user?.username
  )

  // Fetch user attributes to get the email
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes()
        setEmail(attributes.email || user?.username)
      } catch (error) {
        console.error("Error fetching user attributes:", error)
        // Fallback to signInDetails or username
        setEmail(user?.signInDetails?.loginId || user?.username)
      }
    }

    getUserEmail()
  }, [user])

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          username: user?.username,
          email,
        }}
        onSignOut={signOut}
      />
      <Outlet />
    </SidebarProvider>
  )
}

function AppContent() {
  const { authStatus } = useAuthenticator()

  if (authStatus !== "authenticated") {
    return <AuthPages />
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthenticatedLayout />,
      children: [
        { index: true, element: <OverviewPage /> },
        { path: "music", element: <MusicPage /> },
        { path: "news", element: <NewsPage /> },
        { path: "events", element: <EventsPage /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

function App() {
  return (
    <ThemeProvider>
      <Authenticator.Provider>
        <AppContent />
      </Authenticator.Provider>
    </ThemeProvider>
  )
}

export default App
