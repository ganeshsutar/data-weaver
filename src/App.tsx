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

interface AuthenticatedLayoutProps {
  user?: {
    username?: string
    signInDetails?: { loginId?: string }
  }
  signOut?: () => void
}

function AuthenticatedLayout({ user, signOut }: AuthenticatedLayoutProps) {
  // For email-based auth, username is the email
  const email = user?.signInDetails?.loginId || user?.username

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
  const { authStatus, user, signOut } = useAuthenticator()

  if (authStatus !== "authenticated") {
    return <AuthPages />
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthenticatedLayout user={user} signOut={signOut} />,
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
