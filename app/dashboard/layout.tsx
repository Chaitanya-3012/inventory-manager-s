import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitchButton } from "@/components/ui/themeSwitchButton";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { cookies } from "next/headers";
import { validateSessionToken } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication on server side
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await validateSessionToken(token);
  if (!session) {
    redirect("/login");
  }

  // Prepare user data for the sidebar
  const userData = {
    name: session.userName || "User",
    email: session.userEmail || "user@example.com",
    avatar: "/avatars/user.jpg", // You might want to implement proper avatar handling
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar user={userData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <ThemeSwitchButton className="mr-4" />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}