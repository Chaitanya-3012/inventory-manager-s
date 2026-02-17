import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function LoadingOverlay({
  isVisible = false,
  text = "Processing...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-lg font-semibold text-gray-700">{text}</p>
      </div>
    </div>
  );
}
