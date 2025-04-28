"use client";
import { useState, useTransition } from "react";
import { updateSummary, deleteSummary } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

interface SummaryDetailsProps {
  summaryId: string;
  summaryText: string;
  createdAt: string;
}

export default function SummaryDetails({ summaryId, summaryText, createdAt }: SummaryDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayedSummaryText, setDisplayedSummaryText] = useState(summaryText);
  const [editableText, setEditableText] = useState(summaryText);
  const [pending, startTransition] = useTransition();

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableText(displayedSummaryText); // Revert to displayed text on cancel
  };
  const handleSaveClick = () => {
    startTransition(async () => {
      const result = await updateSummary(summaryId, editableText);
      if (result.success) {
        setDisplayedSummaryText(editableText); // Update displayed text on success
        setIsEditing(false);
      }
      // Optionally show toast
    });
  };
  const handleDeleteClick = () => {
    startTransition(async () => {
      await deleteSummary(summaryId);
    });
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Summary Details</h2>
          <div className="text-sm text-muted-foreground">Created on {format(new Date(createdAt), 'PPP')}</div>
        </div>
        <div className="flex space-x-2">
          {!isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={handleEditClick} disabled={pending}>Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={pending}>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your summary.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClick} disabled={pending}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelClick} disabled={pending}>Cancel</Button>
              <Button size="sm" onClick={handleSaveClick} disabled={pending}>Save</Button>
            </>
          )}
        </div>
      </div>
      <div>
        {isEditing ? (
          <Textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="min-h-[70vh]"
            disabled={pending}
          />
        ) : (
          <div className="rounded-lg border bg-card p-4 prose max-w-screen-xl ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedSummaryText}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
