import { getRequest } from "@/lib/service";
import { PostAnalytics } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

export function useAnalytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["author-analytics"],
    queryFn: () => getRequest("/posts/analytics/me"),
  });
  const analytics = data?.data as PostAnalytics;
  const s = analytics?.summary;
  const topPosts = analytics?.topPosts ?? [];
  const recentPosts= analytics?.posts
      ?.filter((p) => p.status === "PUBLISHED")
      .slice(0, 5) ?? [];
  return { analytics, s, topPosts, recentPosts, isLoading, isError };
}
