import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("3");

  const addComment = useMutation(api.comments.addComment);
  const users = useQuery(api.users.getUsers);
  const existingComments = useQuery(api.comments.getComments, { interviewId });

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter comment");

    try {
      await addComment({
        interviewId,
        content: comment.trim(),
        rating: parseInt(rating),
      });

      toast.success("Comment submitted");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit comment");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-5 w-5 ${starValue <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  if (existingComments === undefined || users === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full bg-blue-50 hover:bg-blue-100 text-green-600 hover:text-green-700 transition-all duration-300 ease-in-out"
        >
          <MessageSquareIcon className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Interview Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {existingComments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Previous Comments</h4>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {existingComments.length} Comment{existingComments.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* DISPLAY EXISTING COMMENTS */}
              <ScrollArea className="h-[240px]">
                <div className="space-y-4">
                  {existingComments.map((comment, index) => {
                    const interviewer = getInterviewerInfo(users, comment.interviewerId);
                    return (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4 space-y-3 bg-white hover:shadow-md transition-all duration-300 ease-in-out"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interviewer.image} />
                              <AvatarFallback>{interviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{interviewer.name}</p>
                              <p className="text-xs text-gray-500">
                                {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                              </p>
                            </div>
                          </div>
                          {renderStars(comment.rating)}
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-4">
            {/* RATING */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 rounded-lg">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem
                      key={value}
                      value={value.toString()}
                      className="hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">{renderStars(value)}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* COMMENT */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Your Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed comment about the candidate..."
                className="h-32 bg-gray-50 text-green-400 border-gray-100 rounded-lg focus:ring-2 focus:ring-green-500"/>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 ease-in-out"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white rounded-lg transition-all duration-300 ease-in-out"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;