import FinalsRefreshEffect from "@/actions/finals-refresher";
import { loadGameStore } from "@/actions/game-competition-store-loader";
import BackCompetitionButton from "@/components/competitions/BackCompetitionButton";
import CompetitionStoreLoader from "@/components/competitions/CompetitionStoreLoader";
import GlobalResetButton from "@/components/global/GlobalResetButton";
import Title from "@/components/Title";
import { notFound } from "next/navigation";

export default async function CompetitionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ competition: string }>;
}) {
  const { competition } = await params;

  if (competition !== "top14" && competition !== "prod2") {
    throw notFound();
  }

  const store = await loadGameStore();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <BackCompetitionButton />
          <Title />
          <GlobalResetButton />
        </header>
        <main>
          <CompetitionStoreLoader
            competition={competition}
            calendars={store.calendars}
            teams={store.teams}
          >
            <FinalsRefreshEffect />
            {children}
          </CompetitionStoreLoader>
        </main>
      </div>
    </div>
  );
}
