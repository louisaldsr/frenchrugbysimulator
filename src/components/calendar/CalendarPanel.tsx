import DayMatchs from "./DayMatchs";
import DayTabs from "./DayTabs";

export interface CalendarPanelProps {
  selectedDay: number;
}

export default function CalendarPanel(props: CalendarPanelProps) {
  return (
    <section className="bg-white rounded-xl shadow p-6 h-fit">
      <DayTabs />
      <DayMatchs selectedDay={props.selectedDay} />
    </section>
  );
}
