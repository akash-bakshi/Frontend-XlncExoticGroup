const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  "aria-hidden": true,
} as const;

export const ArrowRightIcon = () => (
  <svg {...stroke}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = () => (
  <svg {...stroke}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg {...stroke}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const ExternalIcon = () => (
  <svg {...stroke}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const MailIcon = () => (
  <svg {...stroke}>
    <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
  </svg>
);
