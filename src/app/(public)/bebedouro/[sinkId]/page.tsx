"use client";

import { useSession } from "~/server/auth/client";
import { If, Then, Else } from "react-if";
import { OperationSink } from "~/components/public/sink/operation";
import { FeedbackSink } from "~/components/public/sink/feedback";

export default function PublicSinkPage() {
  const session = useSession();

  return (
    <If condition={!!session.data?.session}>
      <Then>
        <OperationSink />
      </Then>
      <Else>
        <FeedbackSink />
      </Else>
    </If>
  );
}
