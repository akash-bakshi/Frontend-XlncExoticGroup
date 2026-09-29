import Script from "next/script";

// LeadConnector chat widget.
export function Bot() {
  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6aab056d4f83a252fd542e7d"
      data-source="WEB_USER"
      strategy="lazyOnload"
    />
  );
}
