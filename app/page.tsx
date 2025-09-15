"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard");
    console.log("Button clicked!");
  };
  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}
