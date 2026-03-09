"use client";

import { useState } from "react";
import type { ClinicianNote } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/formatters";
import { Plus, FileText } from "lucide-react";

interface ClinicianNotesProps {
  notes: ClinicianNote[];
}

export function ClinicianNotes({ notes }: ClinicianNotesProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">Clinician Notes</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-teal hover:text-teal"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {/* Simulated add note form */}
        {showForm && (
          <div className="mb-4 rounded-lg border border-border/50 bg-secondary/50 p-3">
            <textarea
              className="w-full resize-none rounded-md bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              rows={3}
              placeholder="Write a clinical note..."
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-7 bg-teal text-xs text-teal-foreground hover:bg-teal/90">
                Save Note
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-border/30 bg-secondary/30 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {note.author}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelativeDate(note.timestamp)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {note.content}
              </p>
              <div className="mt-2 flex gap-1.5">
                {note.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
