import type { Metadata } from "next";
import Image from "next/image";
import { ResetPasswordForm } from "@/components/reset/ResetPasswordForm";
import { LOCATION, LOGO_MARK, privateMetadata, ROUTES, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = privateMetadata("Reset admin password | XLNC Exotic Group");

// No session guard: this page is for an admin who cannot sign in; the backend judges the reset password.
export default function ResetPasswordPage() {
  return (
    <div className="r-stage">
      <a className="r-home" href={ROUTES.home} aria-label={`${SITE_NAME} home`}>
        <Image src={LOGO_MARK.src} width={LOGO_MARK.width} height={LOGO_MARK.height} alt="" loading="eager" />
        <span className="r-home-word">{SITE_NAME}</span>
      </a>
      <ResetPasswordForm />
      <p className="r-stage-foot">{LOCATION}</p>
    </div>
  );
}
