import { Button } from "@/components/ui/button";
import { useFirebase } from "@/hooks/firebase";
import { create } from "@/lib/pointing";
import { useNavigate } from "react-router";
import { useAsyncFn } from "react-use";

const HomePage = () => {
  const navigate = useNavigate();
  const { firestore, user } = useFirebase();

  const [state, handleCreate] = useAsyncFn(async () => {
    if (!user || user === "loading") {
      return;
    }
    const sessionId = await create(firestore, user);
    navigate(`/pointing/${sessionId}`);
  }, [navigate, user, firestore]);

  return (
    <div className="flex flex-col gap-8 items-center">
      <Button disabled={state.loading} onClick={handleCreate}>
        Start session
      </Button>
    </div>
  );
};

export default HomePage;
