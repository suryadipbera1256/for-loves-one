// Defining the strict structure for the timeline events
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  className: string; 
}

// Pre-populated optimized data sequence
export const STORY_DATA: TimelineEvent[] = [
  {
    id: "1",
    title: "The Beginning",
    description: "Our first trip to the rocky shores.",
    mediaUrl: "/placeholder-1.jpg", 
    mediaType: "image",
    className: "md:col-span-2 md:row-span-2", 
  },
  {
    id: "2",
    title: "Adventures",
    description: "Motorcycle rides and endless memories.",
    mediaUrl: "/placeholder-2.jpg",
    mediaType: "image",
    className: "md:col-span-1 md:row-span-1", 
  },
  {
    id: "3",
    title: "The Journey Continues",
    description: "Building our future together.",
    mediaUrl: "/video-placeholder.mp4",
    mediaType: "video",
    className: "md:col-span-1 md:row-span-2", 
  }
];