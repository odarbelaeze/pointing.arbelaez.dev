import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Pointing = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-description">Story description</Label>
        <Textarea id="story-description" />
      </div>
      <div className="flex gap-2">
        <Button variant="destructive">Clear votes</Button>
        <Button>Reveal votes</Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 5, 8, 13, 21, 34, "?"].map((i) => (
          <Button key={i} onClick={() => console.log(i)}>
            {i}
          </Button>
        ))}
      </div>
    </div>
  );
};
