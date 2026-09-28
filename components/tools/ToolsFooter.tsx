import { EMAIL, LOCATION, ROUTES } from "@/lib/site";

export function ToolsFooter() {
  return (
    <footer className="tools-foot">
      <div className="container tools-foot-in">
        <span>{LOCATION}</span>
        <a href={ROUTES.resetPassword}>Reset admin password</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </div>
    </footer>
  );
}
