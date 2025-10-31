"use client";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    author: {
      name: string;
      avatar: string;
      handle: string;
    };
    community?: {
      name: string;
      icon: string;
    };
    image: string;
    publishedAt: string;
    likes: number;
    comments: number;
    bookmarks: number;
    reactions: object;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Post Image */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Image
          width={600}
          height={400}
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Post Content */}
      <div className="p-6 space-y-4">
        {/* Author & Community */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {post.author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {post.publishedAt}
              </p>
            </div>
          </div>
          {post.community && (
            <div className="flex items-center gap-1 px-3 py-1 bg-secondary/50 rounded-full">
              <span className="text-sm">{post.community.icon}</span>
              <span className="text-xs font-medium text-secondary-foreground">
                {post.community.name}
              </span>
            </div>
          )}
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground line-clamp-2 hover:text-primary cursor-pointer transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground py-2 border-t border-b border-border">
          <span>{post.likes.toLocaleString()} likes</span>
          <span>{post.comments} comments</span>
          <span>{post.bookmarks} bookmarks</span>
        </div>

        {/* Reactions Preview */}
        <div className="flex items-center gap-2">
          {Object.entries(post.reactions)
            .slice(0, 3)
            .map(([emoji, count]) => (
              <div
                key={emoji}
                className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full"
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-primary text-primary" : ""
              }`}
            />
            <span className="text-xs">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-accent hover:bg-accent/10"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? "fill-accent text-accent" : ""
              }`}
            />
            <span className="text-xs">Save</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
