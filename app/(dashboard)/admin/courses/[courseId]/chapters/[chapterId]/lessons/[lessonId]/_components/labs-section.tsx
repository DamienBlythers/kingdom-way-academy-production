"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, FlaskConical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Lab {
  id: string;
  title: string;
  description: string;
  instructions: string;
  requiresText: boolean;
  requiresFileUpload: boolean;
  requiresPhoto: boolean;
  requiresVideo: boolean;
  isGraded: boolean;
  maxPoints?: number;
}

interface LabsSectionProps {
  lessonId: string;
  courseId: string;
  chapterId: string;
  initialLabs: Lab[];
}

export function LabsSection({
  lessonId,
  courseId,
  chapterId,
  initialLabs,
}: LabsSectionProps) {
  const [labs, setLabs] = useState<Lab[]>(initialLabs);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const [newLab, setNewLab] = useState({
    title: "",
    description: "",
    instructions: "",
    requiresText: true,
    requiresFileUpload: false,
    requiresPhoto: false,
    requiresVideo: false,
    isGraded: true,
    maxPoints: 100,
  });

  const handleCreate = async () => {
    if (!newLab.title) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/labs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLab),
        }
      );

      if (!response.ok) throw new Error("Failed to create lab");

      const lab = await response.json();
      setLabs([...labs, lab]);
      setIsCreating(false);
      setNewLab({
        title: "",
        description: "",
        instructions: "",
        requiresText: true,
        requiresFileUpload: false,
        requiresPhoto: false,
        requiresVideo: false,
        isGraded: true,
        maxPoints: 100,
      });
      toast.success("Kingdom Lab created successfully! 🎉");
      router.refresh();
    } catch (error) {
      console.error("[LAB_CREATE]", error);
      toast.error("Failed to create lab");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-lg">
          <FlaskConical className="h-5 w-5 text-blue-600" />
          Kingdom Labs
        </span>
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)} 
            variant="ghost" 
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lab
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mt-4 space-y-4 bg-white p-6 rounded-md border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Create New Kingdom Lab</h3>
          
          <div>
            <Label>Lab Title *</Label>
            <Input
              value={newLab.title}
              onChange={(e) => setNewLab({ ...newLab, title: e.target.value })}
              placeholder="e.g., Kingdom Identity Passport"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Short Description</Label>
            <Textarea
              value={newLab.description}
              onChange={(e) => setNewLab({ ...newLab, description: e.target.value })}
              placeholder="Brief overview of what students will do"
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Detailed Instructions</Label>
            <Textarea
              value={newLab.instructions}
              onChange={(e) => setNewLab({ ...newLab, instructions: e.target.value })}
              placeholder="Step-by-step instructions for students..."
              rows={5}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Submission Requirements</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newLab.requiresText}
                    onCheckedChange={(checked) =>
                      setNewLab({ ...newLab, requiresText: !!checked })
                    }
                  />
                  <span className="text-sm cursor-pointer" onClick={() => setNewLab({ ...newLab, requiresText: !newLab.requiresText })}>
                    Text Reflection (Required)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newLab.requiresPhoto}
                    onCheckedChange={(checked) =>
                      setNewLab({ ...newLab, requiresPhoto: !!checked })
                    }
                  />
                  <span className="text-sm cursor-pointer" onClick={() => setNewLab({ ...newLab, requiresPhoto: !newLab.requiresPhoto })}>
                    Photo Evidence
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newLab.requiresVideo}
                    onCheckedChange={(checked) =>
                      setNewLab({ ...newLab, requiresVideo: !!checked })
                    }
                  />
                  <span className="text-sm cursor-pointer" onClick={() => setNewLab({ ...newLab, requiresVideo: !newLab.requiresVideo })}>
                    Video Testimony
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newLab.requiresFileUpload}
                    onCheckedChange={(checked) =>
                      setNewLab({ ...newLab, requiresFileUpload: !!checked })
                    }
                  />
                  <span className="text-sm cursor-pointer" onClick={() => setNewLab({ ...newLab, requiresFileUpload: !newLab.requiresFileUpload })}>
                    Document Upload
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Grading Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newLab.isGraded}
                    onCheckedChange={(checked) =>
                      setNewLab({ ...newLab, isGraded: !!checked })
                    }
                  />
                  <span className="text-sm cursor-pointer" onClick={() => setNewLab({ ...newLab, isGraded: !newLab.isGraded })}>
                    Graded Assignment
                  </span>
                </div>
                {newLab.isGraded && (
                  <div className="pl-6">
                    <Label className="text-xs">Maximum Points</Label>
                    <Input
                      type="number"
                      value={newLab.maxPoints}
                      onChange={(e) =>
                        setNewLab({ ...newLab, maxPoints: parseInt(e.target.value) || 0 })
                      }
                      placeholder="100"
                      className="w-32 mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-2 pt-4">
            <Button 
              onClick={handleCreate} 
              disabled={!newLab.title}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Kingdom Lab
            </Button>
            <Button 
              onClick={() => setIsCreating(false)} 
              variant="outline"
              className="hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!isCreating && labs.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8 italic">
          No Kingdom Labs added yet. Click "Add Lab" to create your first practical assignment!
        </div>
      )}

      {!isCreating && labs.length > 0 && (
        <div className="space-y-2">
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="flex items-center gap-x-3 bg-white border border-slate-200 rounded-md p-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <FlaskConical className="h-4 w-4 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="font-semibold text-sm group-hover:text-blue-700 transition-colors">{lab.title}</div>
                {lab.description && (
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {lab.description}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {lab.requiresText && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    Text
                  </span>
                )}
                {lab.requiresPhoto && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    Photo
                  </span>
                )}
                {lab.requiresVideo && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                    Video
                  </span>
                )}
                {lab.isGraded && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                    {lab.maxPoints}pts
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
