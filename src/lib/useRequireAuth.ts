import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UseRequireAuth() {
  const { data: session } = useSession();
  const route = useRouter();

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      route.push("/login");
    }
  }, [session, route]);

  return session;
}
