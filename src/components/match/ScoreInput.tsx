import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

const INVALID_SCORES = ["1", "2", "4"];

interface ScoreDisplayProps {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  changeScoreAction: (newScore: number) => void;
}

export default function ScoreDisplay(props: ScoreDisplayProps) {
  const { score, setScore, changeScoreAction } = props;
  const [draftScore, setDraftScore] = useState<string>(score.toString());

  const isInputValid = (input: string): number | null => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return 0;
    const parsed = Number(trimmedInput);
    if (isNaN(parsed) || parsed < 0) return null;
    if (INVALID_SCORES.includes(trimmedInput)) return null;
    return parsed;
  };

  const commitNewScore = () => {
    const validScore = isInputValid(draftScore);
    if (validScore !== null) {
      setScore(validScore);
      changeScoreAction(validScore);
    } else {
      setDraftScore(score.toString());
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftScore(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      commitNewScore();
      event.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="\d*"
      value={draftScore}
      onChange={onChange}
      onBlur={commitNewScore}
      onKeyDown={onKeyDown}
      className={`w-16 text-center tabular-nums appearance-none focus:outline-none focus:border-none focus:ring-0`}
    />
  );
}
