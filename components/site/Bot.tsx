import Script from "next/script";

// LeadConnector chat widget.
export function Bot() {
  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6aab0e2b5a00521e71d1e279"
      data-source="WEB_USER"
      strategy="lazyOnload"
    />
  );
}
