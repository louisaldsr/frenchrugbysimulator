import CompetitionCard from "./CompetitionCard";

export default function CompetitionSelector() {
  return (
    <div className="w-full">
      <div className="grid gap-4 sm:grid-cols-2">
        <CompetitionCard competition="top14" />
        <CompetitionCard competition="prod2" />
      </div>
    </div>
  );
}
