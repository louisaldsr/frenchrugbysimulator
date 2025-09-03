import { ScoreProvider } from "@/context/ScoreContext";
import CalendarPanel from "./calendar/CalendarPanel";
import FinalsButton from "./finals/FinalsButton";
import RankingPanel from "./ranking/RankingPanel";

export interface SimulatorProps {
  selectedDay: number;
}

export default async function Simulator(props: SimulatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
      <ScoreProvider>
        <div className="md:col-span-6 flex flex-col gap-6">
          <CalendarPanel selectedDay={props.selectedDay} />
          <FinalsButton />
        </div>
        <div className="md:col-span-4">
          <RankingPanel />
        </div>
      </ScoreProvider>
    </div>
  );
}
