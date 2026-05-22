import { DemoBootstrap, DemoPresenterBar } from "@/components/demo/demo-bootstrap";

export function DemoGlobalChrome() {
  return (
    <>
      <DemoBootstrap />
      <DemoPresenterBar />
      <div className="h-14 shrink-0" aria-hidden />
    </>
  );
}
