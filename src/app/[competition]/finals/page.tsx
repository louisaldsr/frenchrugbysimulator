import BackNavigationButton from "@/components/finals/BackNavigationButton";
import FinalsBrackets from "@/components/finals/FinalsBrackets";
import RefreshFinalsButton from "@/components/finals/RefreshFinalsButton";
import Title from "@/components/Title";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <Title />
        </header>
        <main className="bg-white rounded-xl shadow p-6 h-fit">
          <div className="relative h-9 mb-6">
            <BackNavigationButton className="absolute left-0 top-0" />
            <RefreshFinalsButton className="absolute right-0 top-0" />
          </div>
          <div className="flex flex-col gap-6">
            <FinalsBrackets />
          </div>
        </main>
      </div>
    </div>
  );
}
