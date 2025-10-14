import { Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ModeToggle from "../theme/mode-toggle";

const TopMenu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Resource", href: "/resource" },
  { name: "Features", href: "/feature" },
];
export default function Header01() {
  return (
    <header className="sticky top-5 z-50 container mx-auto flex justify-center px-4">
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full min-w-full rounded-md border px-4 py-2.5 backdrop-blur">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1">
              <Rocket size={32} strokeWidth={2.7} />
              <span className="text-xl font-bold">StarterBlocks</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              {TopMenu.map((menu) => (
                <Link
                  key={`${menu.name}-${menu.href}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    navigationMenuTriggerStyle,
                  )}
                  href={menu.href}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
            <Suspense>
              <ModeToggle />
            </Suspense>
            <div className="flex gap-2">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "default" })}
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1">
              <Rocket size={32} strokeWidth={2.7} />
              <span className="text-xl font-bold">StarterBlocks</span>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-1">
                      <Rocket size={32} strokeWidth={2.7} />
                      <span className="text-xl font-bold">StarterBlocks</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-4 flex flex-col gap-0">
                  {TopMenu.map((menu) => (
                    <Link
                      key={`mobile-${menu.name}-${menu.href}`}
                      href={menu.href}
                      className="py-2 text-lg font-semibold"
                    >
                      {menu.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "default" })}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
