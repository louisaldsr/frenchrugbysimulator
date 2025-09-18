import CalendarPanel from "./calendar/CalendarPanel";
import FinalsButton from "./finals/FinalsButton";
import RankingPanel from "./ranking/RankingPanel";

export interface SimulatorProps {
  selectedDay: number;
}

export default async function Simulator(props: SimulatorProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-20 gap-8">
        <div className="md:col-span-11 flex flex-col gap-6">
          <CalendarPanel selectedDay={props.selectedDay} />
          <FinalsButton />
        </div>
        <div className="md:col-span-9">
          <RankingPanel />
        </div>
      </div>
    </div>
  );
}
