import Simulator from "@/components/Simulator";
import { notFound } from "next/navigation";

export default async function Home(props: PageProps<"/[competition]">) {
  const params = await props.params;
  const competition = params.competition;
  if (competition !== "top14" && competition !== "prod2") {
    throw notFound();
  }

  const searchParams = await props.searchParams;
  const selectedDay = searchParams?.day ? Number(searchParams.day) : 1;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <main>
          <Simulator selectedDay={selectedDay} />
        </main>
      </div>
    </div>
  );
}
