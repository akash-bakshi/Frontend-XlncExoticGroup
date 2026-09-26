import { COMPANIES } from "@/lib/companies";
import { ADDRESS, DESCRIPTION, EMAIL, PHONE_DISPLAY, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text summary for AI assistants and answer engines (llmstxt.org), built from the same data as the site.
export function GET() {
  const companies = COMPANIES.map(
    (company) =>
      `- ${company.url ? `[${company.name}](${company.url})` : company.name} (${company.tag}): ${company.description}`,
  ).join("\n");

  const body = `# ${SITE_NAME}

> ${DESCRIPTION}

${SITE_NAME} founds, funds, and grows a portfolio of companies from San Diego, California. Every company shares the same operating standard and backing: capital, brand, technology, and people.

## What we do

- Build: we found and operate companies from the ground up.
- Back: we invest capital, systems, and expertise into ventures inside the group and beyond.
- Scale: shared brand, technology, and operations compound each company's growth.

## Portfolio companies

${companies}

## Contact

- Website: ${SITE_URL}
- Email: ${EMAIL}
- Phone: ${PHONE_DISPLAY}
- Address: ${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region} ${ADDRESS.postalCode}, ${ADDRESS.country}

Founders, operators, and investors looking to invest or be invested in can reach the group by email.
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
