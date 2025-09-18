interface Props {
  busy: boolean;
}

export default function RefreshIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${
        props.busy ? "animate-spin" : "group-hover:rotate-180"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 1 1-9-9"
      />
    </svg>
  );
}
