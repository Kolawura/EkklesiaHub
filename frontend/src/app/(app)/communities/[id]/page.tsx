import { CommunityHeader } from "@/components/community/community-header";
import { CommunityTabs } from "@/components/community/community-tabs";

interface CommunityPageProps {
  params: { id: string };
}

export default function CommunityPage({ params }: CommunityPageProps) {
  return (
    <div className="w-full">
      <CommunityHeader communityId={params.id} />
      <div className="mt-6 space-y-6">
        <CommunityTabs communityId={params.id} />
      </div>
    </div>
  );
}
