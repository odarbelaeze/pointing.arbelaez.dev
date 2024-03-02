import { ThemeProvider } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <div className="h-screen grid place-items-center bg-background text-foreground">
        <div className="flex flex-col gap-4 items-center">
          <h1>Vite + React</h1>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
