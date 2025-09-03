import { loadGameCompetitionStore } from "@/actions/game-competition-store-loader";
import BackCompetitionButton from "@/components/competitions/BackCompetitionButton";
import CompetitionStoreLoader from "@/components/competitions/CompetitionStoreLoader";
import Simulator from "@/components/Simulator";
import Title from "@/components/Title";
import { notFound } from "next/navigation";
import { PageProps } from "../../../.next/types/app/page";

export default async function Home(props: PageProps) {
  const params = await props.params;
  const competition = params.competition;
  if (competition !== "top14" && competition !== "prod2") {
    throw notFound();
  }
  const store = await loadGameCompetitionStore(competition);

  const searchParams = await props.searchParams;
  const selectedDay = searchParams?.day ? Number(searchParams.day) : 1;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <CompetitionStoreLoader competition={competition} store={store}>
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <BackCompetitionButton />
            <Title />
          </header>
          <main>
            <Simulator selectedDay={selectedDay} />
          </main>
        </div>
      </CompetitionStoreLoader>
    </div>
  );
}
