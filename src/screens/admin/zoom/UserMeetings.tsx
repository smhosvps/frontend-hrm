/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetUserMeetingsQuery,
} from "@/redux/features/zoomApi/zoomApi";
import { Loader2, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";

export default function UserMeetings() {
  const { data, isLoading, error } = useGetUserMeetingsQuery({});
  const { data: allUsers } = useGetAllUsersQuery({});
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [showEmbeddedZoom, setShowEmbeddedZoom] = useState(false);
  const [zoomIframeLoaded, setZoomIframeLoaded] = useState(false);

  // Build a map of userId -> full name for quick lookup
  const usersList = allUsers?.users || [];
  const hostMap = new Map(
    usersList.map((user: any) => [
      user._id,
      `${user.firstName} ${user.lastName}`,
    ])
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load meetings. Please try again.
      </div>
    );
  }

  const meetings = data?.meetings || [];

  // Embedded Zoom Component (uses selectedMeeting)
  const EmbeddedZoomMeeting = () => {
    if (!selectedMeeting) return null;

    const getEmbeddedZoomUrl = () => {
      if (!selectedMeeting?.joinUrl) return "";
      try {
        const url = new URL(selectedMeeting.joinUrl);
        const meetingNumber = url.pathname.split("/").pop();
        const password = url.searchParams.get("pwd");
        return `https://us05web.zoom.us/wc/join/${meetingNumber}?pwd=${password}`;
      } catch {
        return selectedMeeting.joinUrl; // fallback
      }
    };

    const handleClose = () => {
      setShowEmbeddedZoom(false);
      setSelectedMeeting(null);
      setZoomIframeLoaded(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                {selectedMeeting.topic}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Zoom Iframe */}
          <div className="flex-1 relative bg-black">
            {!zoomIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white px-4">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-sm sm:text-lg">Loading Zoom Meeting...</p>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2">
                    Please wait while we connect you
                  </p>
                </div>
              </div>
            )}

            <iframe
              src={getEmbeddedZoomUrl()}
              className="w-full h-full"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              onLoad={() => setZoomIframeLoaded(true)}
              title="Zoom Meeting"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  };

  const handleJoinMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setShowEmbeddedZoom(true);
  };

  const isMeetingPast = (startTime: string, duration: number) => {
    const meetingEnd = new Date(startTime).getTime() + duration * 60000;
    return meetingEnd < Date.now();
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-0 md:px-4">
      {showEmbeddedZoom && <EmbeddedZoomMeeting />}

      <div className="max-w-7xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          My Meetings
        </h1>

        {meetings.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No Meeting yet</p>
            <p className="text-gray-500 text-sm mt-1">
              No meetings assigned to you.
            </p>
          </div>

        ) : (
          <div className="space-y-3 sm:space-y-4">
            {meetings.map((item: any) => {
              const hostId = item.meeting.host?._id;
              const hostName: any = hostId ? hostMap.get(hostId) : null;
              const meetingPast = isMeetingPast(item.meeting.startTime, item.meeting.duration);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    {/* Meeting Info */}
                    <div className="flex-1 w-full">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                        {item.meeting.topic}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                        {item.meeting.description}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          📅 {new Date(item.meeting.startTime).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        <span className="inline-flex items-center">
                          ⏱️ {item.meeting.duration} min
                        </span>
                        <span className="inline-flex items-center truncate max-w-[150px] sm:max-w-[200px]">
                          👤 Host: {hostName || "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Received: {new Date(item.receivedAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-end w-full sm:w-auto">
                      {!meetingPast && (
                        <Button
                          onClick={() => handleJoinMeeting(item.meeting)}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto rounded-[6px] border border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 text-xs sm:text-sm py-1.5 sm:py-2"
                        >
                          <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}