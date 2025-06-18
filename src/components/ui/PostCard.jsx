import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

export default function PostCard({ post }) {
  if (!post) return null; // ✅ Avoids error if post is undefined

  return (
    <Card className="p-4 shadow-md rounded-2xl bg-black w-full text-white">
      <CardContent className="flex flex-col gap-4">
        {/* Profile and User Info */}
        <div className="flex items-center gap-3">
          <img
            src={post?.profileImage || "/default-profile.png"} // ✅ Avoids error
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-lg font-semibold">{post?.username || "User"}</h4>
            <p className="text-sm text-gray-400">{post?.timestamp || "Just now"}</p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-300">{post?.content || "Hello"}</p>

        {/* Post Image (if available) */}
        {post?.image ? (
          <img
            src={post.image}
            alt="Post"
            className="rounded-xl max-h-80 object-cover"
          />
        ) : null}

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-3 mt-2">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-400">
            <ThumbsUp className="w-5 h-5 text-blue-500" />
            Like
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-400">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Comment
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-400">
            <Share2 className="w-5 h-5 text-yellow-500" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
