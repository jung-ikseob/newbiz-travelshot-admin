import { useRouter } from "next/router";
import { useEffect } from "react";

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shinhan/card-stats");
  }, [router]);

  return null;
};

export default IndexPage;
