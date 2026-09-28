import Image from "next/image";
import { FOOTER_COMPANIES } from "@/lib/companies";
import { ADDRESS, EMAIL, LOCATION, LOGO, PHONE, PHONE_DISPLAY, SITE_NAME, SOCIAL_PROFILES } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src={LOGO.src} width={LOGO.width} height={LOGO.height} alt={SITE_NAME} />
            <p>
              A San Diego venture group building, backing, and scaling exceptional companies across seven
              industries. Dreams to reality.
            </p>
          </div>
          <div className="footer-col">
            <h3>Portfolio</h3>
            {FOOTER_COMPANIES.map((company) => (
              <a key={company.slug} href={company.url} target="_blank" rel="noopener">
                {company.name}
              </a>
            ))}
          </div>
          <div className="footer-col">
            <h3>Group</h3>
            <a href="#approach">Approach</a>
            <a href="#sectors">Sectors</a>
            <a href="#invest">Invest</a>
            <address>
              {ADDRESS.street}
              <br />
              {`${ADDRESS.locality}, ${ADDRESS.region} ${ADDRESS.postalCode}`}
              <br />
              <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
              <br />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </address>
          </div>
          {SOCIAL_PROFILES.length > 0 && (
            <div className="footer-col">
              <h3>Follow</h3>
              {SOCIAL_PROFILES.map((profile) => (
                <a key={profile.url} href={profile.url} target="_blank" rel="noopener me">
                  {profile.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <span>{`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`}</span>
          <span>{LOCATION}</span>
        </div>
      </div>
    </footer>
  );
}
