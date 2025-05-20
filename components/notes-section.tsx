"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Trash, Save, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

interface NotesSectionProps {
  courseId: string
}

export function NotesSection({ courseId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { notes, fetchNotes, addNote, editNote, removeNote } = useStore()
  const { toast } = useToast()

  useEffect(() => {
    const loadNotes = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        await fetchNotes(user.uid, courseId)
      } catch (error) {
        console.error("Error loading notes:", error)
        toast({
          title: "Error",
          description: "Failed to load your notes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [user, courseId, fetchNotes, toast])

  const handleAddNote = async () => {
    if (!user || !newNote.trim()) return

    try {
      await addNote(user.uid, courseId, newNote)
      setNewNote("")
      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      })
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "Error",
        description: "Failed to add your note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditNote = async (noteId: string) => {
    if (!editedContent.trim()) return

    try {
      await editNote(noteId, editedContent)
      setEditingNoteId(null)
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Error",
        description: "Failed to update your note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await removeNote(courseId, noteId)
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete your note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEditing = (noteId: string, content: string) => {
    setEditingNoteId(noteId)
    setEditedContent(content)
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditedContent("")
  }

  if (!user) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-300">Please sign in to add notes.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <LoadingSpinner />
      </div>
    )
  }

  const courseNotes = notes[courseId] || []

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add a New Note</h3>
        <Textarea
          placeholder="Write your notes here..."
          className="min-h-[100px] bg-[#111111] border-[#333333]"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button onClick={handleAddNote} disabled={!newNote.trim()} className="bg-[#f90026] hover:bg-[#d10021]">
          Save Note
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Notes</h3>
        {courseNotes.length === 0 ? (
          <p className="text-gray-300">You haven't added any notes for this course yet.</p>
        ) : (
          <div className="space-y-4">
            {courseNotes.map((note) => (
              <Card key={note.id} className="bg-[#111111] border-[#333333]">
                <CardContent className="p-4">
                  {editingNoteId === note.id ? (
                    <Textarea
                      className="min-h-[100px] bg-[#1e1e1e] border-[#333333]"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                  )}
                </CardContent>
                <CardFooter className="px-4 py-3 border-t border-[#333333] flex justify-between">
                  <div className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="flex space-x-2">
                    {editingNoteId === note.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 border-green-600 hover:bg-green-600/20"
                          onClick={() => handleEditNote(note.id)}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 border-gray-500 hover:bg-gray-600/20"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 border-[#333333] hover:bg-[#1e1e1e]"
                          onClick={() => startEditing(note.id, note.content)}
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 border-red-600 hover:bg-red-600/20"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
