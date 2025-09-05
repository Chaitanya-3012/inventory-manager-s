import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ButtonIcon } from "@/components/ui/iconButton";
import DataPage from "./parts/data-page";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <ButtonIcon className="mr-4" varient="theme" />
        </header>
        {/*Main Content*/}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <DataPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
