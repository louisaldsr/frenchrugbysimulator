import CompetitionSelector from "@/components/competitions/CompetitionSelector";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <main>
          <CompetitionSelector />
        </main>
      </div>
    </div>
  );
}
