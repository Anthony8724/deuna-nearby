import { AppLoader } from "@/components/ui/app-loader";

export default function Loading() {
  return (
    <div className="home-app flex min-h-screen items-center justify-center">
      <AppLoader />
    </div>
  );
}
