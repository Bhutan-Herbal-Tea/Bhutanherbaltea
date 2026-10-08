import type { ReactNode } from "react";

// Re-mounts on every navigation, replaying the CSS fade (disabled under reduced motion).
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
