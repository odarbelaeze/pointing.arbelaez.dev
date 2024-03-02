import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={cn(
        "h-screen grid place-items-center bg-background text-foreground",
        { dark: darkMode },
      )}
    >
      <div className="flex flex-col gap-4 items-center">
        <h1>Vite + React</h1>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <div className="flex gap-2 items-center">
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={() => setDarkMode((pv) => !pv)}
          />
          <Label htmlFor="dark-mode">Dark mode</Label>
        </div>
      </div>
    </div>
  );
}

export default App;
