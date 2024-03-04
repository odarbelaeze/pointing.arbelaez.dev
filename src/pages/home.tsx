import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";

export const HomePage = () => {
  const navigate = useNavigate();

  const [state, createSession] = useAsyncFn(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/pointing/1234");
  }, [navigate]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <Button disabled={state.loading} onClick={createSession}>
        Start session
      </Button>
    </div>
  );
};
