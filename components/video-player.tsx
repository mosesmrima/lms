"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Play, Pause, Volume2, VolumeX, Maximize, Clock, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import type { Timestamp } from "@/lib/types"

interface VideoPlayerProps {
  url: string
  title: string
  timestamps?: Timestamp[]
  courseId?: string
  lessonId?: string
  onTimeUpdate?: (currentTime: number) => void
  className?: string
}

export function VideoPlayer({
  url,
  title,
  timestamps = [],
  courseId,
  lessonId,
  onTimeUpdate,
  className,
}: VideoPlayerProps) {
  const [videoType, setVideoType] = useState<"youtube" | "drive" | "unknown">("unknown")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [isTimestampsPanelOpen, setIsTimestampsPanelOpen] = useState(false)
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAuth()

  // YouTube API player
  const [ytPlayer, setYtPlayer] = useState<any>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!url) {
      setError("No video URL provided")
      return
    }

    // Extract YouTube video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)

    // Extract Google Drive ID
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/
    const driveMatch = url.match(driveRegex)

    if (youtubeMatch && youtubeMatch[1]) {
      setVideoType("youtube")
      setVideoId(youtubeMatch[1])
    } else if (driveMatch && driveMatch[1]) {
      setVideoType("drive")
      setVideoId(driveMatch[1])
    } else {
      setError("Unsupported video URL format. Please use YouTube or Google Drive links.")
    }
  }, [url])

  // Load YouTube API
  useEffect(() => {
    if (videoType !== "youtube" || !videoId) return

    // Only load the API once
    if (window.YT) return

    // Create script tag
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"

    // Add to page
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Setup callback
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready")
    }

    return () => {
      window.onYouTubeIframeAPIReady = null
    }
  }, [videoType, videoId])

  // Initialize YouTube player
  useEffect(() => {
    if (videoType !== "youtube" || !videoId || !window.YT || !window.YT.Player) return

    const player = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
      },
      events: {
        onReady: (event: any) => {
          setYtPlayer(event.target)
          setDuration(event.target.getDuration())
          setIsLoading(false)
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          if (event.data === window.YT.PlayerState.PLAYING) {
            startTimeTracking()
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            stopTimeTracking()
          }
        },
        onError: () => {
          setError("Error loading YouTube video")
        },
      },
    })

    return () => {
      if (player && player.destroy) {
        player.destroy()
      }
    }
  }, [videoType, videoId])

  // Time tracking interval
  const startTimeTracking = () => {
    const interval = setInterval(() => {
      if (ytPlayer && typeof ytPlayer.getCurrentTime === "function") {
        const time = ytPlayer.getCurrentTime()
        setCurrentTime(time)

        if (onTimeUpdate) {
          onTimeUpdate(time)
        }

        // Find active timestamp
        const active = timestamps.find((ts, index) => {
          const nextTs = timestamps[index + 1]
          const tsTime = ts.time
          const nextTime = nextTs ? nextTs.time : Number.POSITIVE_INFINITY
          return time >= tsTime && time < nextTime
        })

        setActiveTimestamp(active ? active.id : null)
      }
    }, 1000)

    return interval
  }

  const stopTimeTracking = () => {
    // This will be called when we need to stop the interval
  }

  // Handle play/pause
  const togglePlay = () => {
    if (!ytPlayer) return

    if (isPlaying) {
      ytPlayer.pauseVideo()
    } else {
      ytPlayer.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!ytPlayer) return

    const newVolume = value[0]
    setVolume(newVolume)
    ytPlayer.setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (!ytPlayer) return

    if (isMuted) {
      ytPlayer.unMute()
      ytPlayer.setVolume(volume)
      setIsMuted(false)
    } else {
      ytPlayer.mute()
      setIsMuted(true)
    }
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!ytPlayer) return

    const seekTime = (value[0] / 100) * duration
    ytPlayer.seekTo(seekTime, true)
    setCurrentTime(seekTime)
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle timestamp click
  const jumpToTimestamp = (time: number) => {
    if (!ytPlayer) return

    ytPlayer.seekTo(time, true)
    setCurrentTime(time)

    // If video is not playing, start it
    if (!isPlaying) {
      ytPlayer.playVideo()
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Prevent right-click on video
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (videoType === "youtube" && videoId) {
    return (
      <div className={cn("relative group w-full max-w-full overflow-hidden", className)}>
        <div
          ref={playerRef}
          className="aspect-video w-full bg-black rounded-lg overflow-hidden relative"
          onMouseMove={handleMouseMove}
          onTouchStart={() => setShowControls(true)}
          onContextMenu={handleContextMenu}
        >
          {/* YouTube Player */}
          <div className="absolute inset-0 pointer-events-none">
            <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
          </div>

          {/* Overlay to prevent interaction with iframe directly */}
          <div className="absolute inset-0 z-10" onClick={togglePlay}></div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {/* Watermark */}
          {!isLoading && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/30 text-xs sm:text-sm font-medium z-20 pointer-events-none">
              Africa Hack On LMS
            </div>
          )}

          {/* Custom Controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 sm:p-4 transition-opacity duration-300 z-30",
              showControls || !isPlaying ? "opacity-100" : "opacity-0",
            )}
          >
            {/* Progress bar */}
            <div className="mb-1 sm:mb-2">
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Play/Pause button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20 p-1"
                >
                  {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>

                {/* Volume control - hide on mobile */}
                {!isMobile && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20 p-1"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </Button>
                    <div className="w-12 sm:w-20 hidden sm:block">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Time display */}
                <div className="text-white text-xs sm:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Timestamps toggle */}
                {timestamps && timestamps.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsTimestampsPanelOpen(!isTimestampsPanelOpen)}
                          className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20 relative p-1"
                        >
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                          {activeTimestamp && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#f90026] rounded-full"></span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Timestamps</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Fullscreen button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20 p-1"
                      >
                        <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fullscreen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Anti-copy message on right click */}
          <div
            className="hidden group-contextmenu:flex absolute inset-0 items-center justify-center bg-black/90 z-50"
            onContextMenu={handleContextMenu}
          >
            <div className="text-center p-4 sm:p-6">
              <Lock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-[#f90026]" />
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Content Protected</h3>
              <p className="text-gray-300 text-sm sm:text-base">This video is protected and cannot be downloaded.</p>
            </div>
          </div>
        </div>

        {/* Timestamps panel */}
        {isTimestampsPanelOpen && timestamps && timestamps.length > 0 && (
          <div className="mt-3 sm:mt-4 bg-[#1e1e1e] border border-[#333333] rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Video Timestamps
            </h3>
            <div className="space-y-1 sm:space-y-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-2">
              {timestamps.map((timestamp) => (
                <button
                  key={timestamp.id}
                  onClick={() => jumpToTimestamp(timestamp.time)}
                  className={cn(
                    "w-full text-left p-2 rounded-md flex items-start hover:bg-[#333333] transition-colors",
                    activeTimestamp === timestamp.id ? "bg-[#333333]" : "",
                  )}
                >
                  <span className="text-xs sm:text-sm font-mono text-gray-400 mr-2 sm:mr-3 mt-0.5">
                    {formatTime(timestamp.time)}
                  </span>
                  <div>
                    <div className="font-medium text-xs sm:text-sm">{timestamp.title}</div>
                    {timestamp.description && (
                      <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">{timestamp.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (videoType === "drive" && videoId) {
    return (
      <div className={cn("relative w-full max-w-full overflow-hidden", className)}>
        <div className="aspect-video w-full">
          <iframe
            src={`https://drive.google.com/file/d/${videoId}/preview`}
            title={title}
            className="w-full h-full rounded-lg"
            allow="autoplay"
            allowFullScreen
            ref={iframeRef}
          ></iframe>

          {/* Overlay to prevent easy downloading */}
          <div className="absolute inset-0 z-10 pointer-events-none" onContextMenu={handleContextMenu}></div>

          {/* Watermark */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/30 text-xs sm:text-sm font-medium z-20 pointer-events-none">
            Africa Hack On LMS
          </div>
        </div>

        {/* Timestamps for Drive videos (simplified) */}
        {timestamps && timestamps.length > 0 && (
          <div className="mt-3 sm:mt-4 bg-[#1e1e1e] border border-[#333333] rounded-lg p-3 sm:p-4">
            <h3 className="font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Video Timestamps
            </h3>
            <div className="grid gap-1 sm:gap-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-2">
              {timestamps.map((timestamp) => (
                <div key={timestamp.id} className="p-2 rounded-md">
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-mono text-gray-400 mr-2 sm:mr-3">
                      {formatTime(timestamp.time)}
                    </span>
                    <div className="font-medium text-xs sm:text-sm">{timestamp.title}</div>
                  </div>
                  {timestamp.description && (
                    <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 ml-8 sm:ml-12">{timestamp.description}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
              <p>Note: Direct timestamp navigation is not available for Google Drive videos.</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="aspect-video w-full bg-[#111111] rounded-lg flex items-center justify-center text-gray-500">
      Loading video...
    </div>
  )
}
