"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Clock, Plus, Trash, Save } from "lucide-react"
import type { Timestamp } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TimestampEditorProps {
  timestamps: Timestamp[]
  onChange: (timestamps: Timestamp[]) => void
  currentTime?: number
  className?: string
}

export function TimestampEditor({ timestamps, onChange, currentTime = 0, className }: TimestampEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingTimestamp, setEditingTimestamp] = useState<Timestamp | null>(null)

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Parse MM:SS to seconds
  const parseTime = (timeString: string): number => {
    const parts = timeString.split(":")
    if (parts.length !== 2) return 0

    const minutes = Number.parseInt(parts[0], 10)
    const seconds = Number.parseInt(parts[1], 10)

    if (isNaN(minutes) || isNaN(seconds)) return 0

    return minutes * 60 + seconds
  }

  const handleAddTimestamp = () => {
    const newTimestamp: Timestamp = {
      id: `timestamp-${Date.now()}`,
      title: "New Timestamp",
      description: "",
      time: currentTime || 0,
    }

    const newTimestamps = [...timestamps, newTimestamp]
    // Sort by time
    newTimestamps.sort((a, b) => a.time - b.time)

    onChange(newTimestamps)

    // Start editing the new timestamp
    setEditingIndex(newTimestamps.findIndex((t) => t.id === newTimestamp.id))
    setEditingTimestamp(newTimestamp)
  }

  const handleEditTimestamp = (index: number) => {
    setEditingIndex(index)
    setEditingTimestamp({ ...timestamps[index] })
  }

  const handleDeleteTimestamp = (index: number) => {
    const newTimestamps = [...timestamps]
    newTimestamps.splice(index, 1)
    onChange(newTimestamps)

    // Clear editing state if deleting the one being edited
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditingTimestamp(null)
    } else if (editingIndex && editingIndex > index) {
      // Adjust editing index if deleting one before it
      setEditingIndex(editingIndex - 1)
    }
  }

  const handleSaveTimestamp = () => {
    if (editingIndex === null || !editingTimestamp) return

    const newTimestamps = [...timestamps]
    newTimestamps[editingIndex] = editingTimestamp

    // Sort by time
    newTimestamps.sort((a, b) => a.time - b.time)

    onChange(newTimestamps)

    // Update editing index to match the new position after sorting
    const newIndex = newTimestamps.findIndex((t) => t.id === editingTimestamp.id)
    setEditingIndex(newIndex)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingTimestamp(null)
  }

  const handleCaptureCurrentTime = () => {
    if (editingIndex === null || !editingTimestamp) return

    setEditingTimestamp({
      ...editingTimestamp,
      time: currentTime,
    })
  }

  return (
    <Card className={cn("bg-[#1e1e1e] border-[#333333] p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Video Timestamps
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTimestamp}
          className="border-[#333333] hover:bg-[#333333]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Timestamp
        </Button>
      </div>

      {timestamps.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No timestamps added yet</p>
          <p className="text-sm">Add timestamps to help students navigate the video</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timestamps.map((timestamp, index) => (
            <div
              key={timestamp.id}
              className={cn(
                "p-3 rounded-md",
                editingIndex === index ? "bg-[#333333]" : "bg-[#252525] hover:bg-[#2a2a2a]",
              )}
            >
              {editingIndex === index ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Title</label>
                      <Input
                        value={editingTimestamp?.title || ""}
                        onChange={(e) =>
                          setEditingTimestamp({
                            ...editingTimestamp!,
                            title: e.target.value,
                          })
                        }
                        className="bg-[#1e1e1e] border-[#444444]"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-gray-400 mb-1 block">Time</label>
                      <div className="flex items-center gap-1">
                        <Input
                          value={formatTime(editingTimestamp?.time || 0)}
                          onChange={(e) =>
                            setEditingTimestamp({
                              ...editingTimestamp!,
                              time: parseTime(e.target.value),
                            })
                          }
                          className="bg-[#1e1e1e] border-[#444444] font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCaptureCurrentTime}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          title="Use current video time"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Description (optional)</label>
                    <Textarea
                      value={editingTimestamp?.description || ""}
                      onChange={(e) =>
                        setEditingTimestamp({
                          ...editingTimestamp!,
                          description: e.target.value,
                        })
                      }
                      className="bg-[#1e1e1e] border-[#444444] min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveTimestamp}
                      className="bg-[#f90026] hover:bg-[#d10021]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-mono text-gray-400 mr-3">{formatTime(timestamp.time)}</span>
                      <h4 className="font-medium">{timestamp.title}</h4>
                    </div>
                    {timestamp.description && (
                      <p className="text-sm text-gray-400 mt-1 ml-12">{timestamp.description}</p>
                    )}
                  </div>
                  <div className="flex items-start gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTimestamp(index)}
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTimestamp(index)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
