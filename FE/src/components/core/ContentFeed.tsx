import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Lock, Heart, MessageCircle, Share2, Play, Image as ImageIcon, Music, Clock, Crown } from "lucide-react";

interface ContentPost {
  id: number;
  title: string;
  content: string;
  mediaType: "image" | "video" | "audio" | "text";
  mediaUrl?: string;
  tierRequired: "Public" | "Fan" | "Supporter" | "VIP" | "Diamond";
  minTokens: number;
  createdAt: Date;
  likes: number;
  comments: number;
  isLocked: boolean;
  preview?: string;
}

interface ContentFeedProps {
  posts: ContentPost[];
  creatorName: string;
  creatorAvatar: string;
  tokenTicker: string;
  userTokenBalance?: number;
}

const ContentFeed = ({ posts, creatorName, creatorAvatar, tokenTicker, userTokenBalance = 0 }: ContentFeedProps) => {
  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Fan":
        return "text-gray-400 border-gray-500/30";
      case "Supporter":
        return "text-blue-400 border-blue-500/30";
      case "VIP":
        return "text-purple-400 border-purple-500/30";
      case "Diamond":
        return "text-cyan-400 border-cyan-500/30";
      default:
        return "text-muted-foreground border-border";
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-card/50 backdrop-blur-sm border-border/40 overflow-hidden hover:shadow-elevation transition-smooth">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={creatorAvatar} alt={creatorName} />
                <AvatarFallback>{creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{creatorName}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getTierColor(post.tierRequired)} font-semibold`}
            >
              {post.tierRequired !== "Public" && <Crown className="h-3 w-3 mr-1" />}
              {post.tierRequired}
            </Badge>
          </div>

          {/* Post Content */}
          <CardContent className="p-0">
            {/* Media Preview */}
            {post.mediaType !== "text" && (
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                {post.isLocked ? (
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-border/60 max-w-sm">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold text-xl mb-2">Locked Content</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Hold <span className="font-bold text-primary">{post.minTokens} {tokenTicker}</span> to unlock this exclusive content
                      </p>
                      <div className="space-y-2">
                        <Button variant="cta" className="w-full">
                          Buy {tokenTicker}
                        </Button>
                        {userTokenBalance > 0 && (
                          <p className="text-xs text-muted-foreground">
                            You have {userTokenBalance} {tokenTicker} • Need {post.minTokens - userTokenBalance} more
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Blurred preview hint */}
                    <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20">
                      {getMediaIcon(post.mediaType)}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="text-center p-8">
                      <div className="mb-4 text-primary">
                        {getMediaIcon(post.mediaType)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.mediaType === "video" && "Video content"}
                        {post.mediaType === "audio" && "Audio content"}
                        {post.mediaType === "image" && "Image content"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {post.title}
                  {post.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </h3>
                <p className={`text-muted-foreground ${post.isLocked && post.mediaType === "text" ? "blur-sm select-none" : ""}`}>
                  {post.isLocked && post.mediaType === "text" 
                    ? "This exclusive text content is locked. Hold tokens to read the full post..." 
                    : post.content
                  }
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 pt-2 border-t border-border/40">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth ml-auto">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              {/* Unlock CTA for locked content */}
              {post.isLocked && (
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Unlock with <span className="font-bold text-foreground">{post.minTokens} {tokenTicker}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.tierRequired} tier required
                      </p>
                    </div>
                    <Button variant="hero" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
          <p className="text-muted-foreground">
            {creatorName} hasn't posted any content yet. Follow to be notified!
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentFeed;