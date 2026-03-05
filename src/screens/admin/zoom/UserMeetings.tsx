/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetUserMeetingsQuery,
  useAcknowledgeMeetingMutation,
} from "@/redux/features/zoomApi/zoomApi";
import { Loader2, Video, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UserMeetings() {
  const { data, isLoading, error, refetch } = useGetUserMeetingsQuery({});
  const { data: allUsers } = useGetAllUsersQuery({});
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [showEmbeddedZoom, setShowEmbeddedZoom] = useState(false);
  const [zoomIframeLoaded, setZoomIframeLoaded] = useState(false);
  const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);
  const [acknowledge] = useAcknowledgeMeetingMutation();

  // Build a map of userId -> full name for quick lookup
  const usersList = allUsers?.users || [];
  const hostMap = new Map(
    usersList.map((user: any) => [
      user._id,
      `${user.firstName} ${user.lastName}`,
    ])
  );

  const handleAcknowledge = async (receiptId: string) => {
    try {
      await acknowledge(receiptId).unwrap();
      toast.success("Meeting attendance marked successfully");
      refetch();
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.message || "Failed to mark attendance");
    }
  };

  const copyToClipboard = async (text: string, id: string, type: 'password' | 'unique') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'password') {
        setCopiedPasswordId(id);
        setTimeout(() => setCopiedPasswordId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Find the receipt ID for the selected meeting
  useEffect(() => {
    if (selectedMeeting && data?.meetings) {
      const receipt = data.meetings.find(
        (item: any) => item.meeting._id === selectedMeeting._id
      );
      if (receipt) {
        setSelectedReceiptId(receipt._id);
      }
    }
  }, [selectedMeeting, data]);

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

    console.log(selectedMeeting, "select meeting")
    console.log(selectedReceiptId, "receipt id")

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
      setSelectedReceiptId(null);
      setZoomIframeLoaded(false);
    };

    const handleMarkAttendance = async () => {
      if (selectedReceiptId) {
        await handleAcknowledge(selectedReceiptId);
      } else {
        toast.error("Receipt ID not found");
      }
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

          {/* Attendance Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mark your attendance after joining the meeting
              </p>
              <Button
                onClick={handleMarkAttendance}
                className="bg-green-600 hover:bg-green-700 text-white rounded-[6px]"
                size="sm"
                disabled={!selectedReceiptId}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleJoinMeeting = (meeting: any, receiptId: string) => {
    setSelectedMeeting(meeting);
    setSelectedReceiptId(receiptId);
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
              const isAcknowledged = item.status === 'read';

              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-lg sm:rounded-xl border p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${
                    isAcknowledged ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    {/* Meeting Info */}
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words uppercase">
                          {item.meeting.topic}
                        </h3>
                        {isAcknowledged && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <Check className="w-3 h-3 mr-1" />
                            Attended
                          </span>
                        )}
                      </div>
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

                      {/* Meeting Password with Copy Button */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="font-bold text-blue-800">
                          Password: {item.meeting.meetingPassword}
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.meeting.meetingPassword, item._id, 'password')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          title="Copy password"
                        >
                          {copiedPasswordId === item._id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedPasswordId === item._id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>

                      <p className="text-xs mt-3 text-gray-500">To join the meeting, please copy the meeting password and replace Meeting Passcode.</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-end w-full sm:w-auto">
                      {!meetingPast && !isAcknowledged && (
                        <Button
                          onClick={() => handleJoinMeeting(item.meeting, item._id)}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto rounded-[6px] border border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 text-xs sm:text-sm py-1.5 sm:py-2"
                        >
                          <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Join
                        </Button>
                      )}
                      {isAcknowledged && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Attendance Marked
                        </span>
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