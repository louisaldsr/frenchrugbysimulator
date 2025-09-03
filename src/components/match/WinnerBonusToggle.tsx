import { MatchSide } from "@/types/Match";

interface Props {
  bonus: boolean;
  side: MatchSide;
  onToggle: () => void;
}

export default function WinnerBonusToggle(props: Props) {
  const { bonus, side, onToggle } = props;

  return (
    <button
      onClick={onToggle}
      className={`
        px-2 py-0.5 rounded-md border text-xs font-bold
        ${
          bonus
            ? "bg-green-600 text-white border-green-700"
            : "bg-white text-green-700 border-green-600 hover:bg-green-50"
        }
        ${side === "home" ? "mr-2" : "ml-2"}
      `}
      aria-label="Offensive bonus"
    >
      BO
    </button>
  );
}
