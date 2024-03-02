import moment, { MomentInput } from "moment";
import { useEffect, useState } from "react";

interface MomentProps {
  dateTime: MomentInput;
}

export const Moment = ({ dateTime }: MomentProps) => {
  const mmt = moment(dateTime);
  const [text, setText] = useState(() => mmt.fromNow());
  useEffect(() => {
    const interval = setInterval(() => {
      setText(mmt.fromNow());
    }, 10000);
    return () => clearInterval(interval);
  }, [mmt]);
  return (
    <time dateTime={mmt.toISOString()} title={mmt.toISOString()}>
      {text}
    </time>
  );
};
