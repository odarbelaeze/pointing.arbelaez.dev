import { Pointing } from "./components/pointing";
import { ThemeProvider } from "@/components/providers/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen grid place-items-center bg-background text-foreground">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-4xl font-bold">Pointing stuff</h1>
          <Pointing />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
