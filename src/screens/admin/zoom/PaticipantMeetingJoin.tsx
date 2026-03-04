/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useAcknowledgeMeetingMutation, useGetMeetingQuery } from "@/redux/features/zoomApi/zoomApi";
import { CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PaticipantMeetingJoin() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [showEmbeddedZoom, setShowEmbeddedZoom] = useState(false);
  const [zoomIframeLoaded, setZoomIframeLoaded] = useState(false);
  const [acknowledge] = useAcknowledgeMeetingMutation();
  const {
    data: meetingData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMeetingQuery<any>(meetingId, {
    skip: !meetingId,
    refetchOnMountOrArgChange: true,
  });

  console.log(meetingData, "dhdhdh")


    const handleAcknowledge = async (receiptId: string) => {
    try {
      await acknowledge(receiptId).unwrap();
      toast.success("Meeting acknowledged");
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Failed to acknowledge");
    }
  };


  // Auto-refresh meeting status if it's upcoming
  useEffect(() => {
    if (meetingData?.meeting?.startTime) {
      const meetingTime = new Date(meetingData.meeting.startTime).getTime();
      const now = new Date().getTime();
      const timeUntilMeeting = meetingTime - now;

      // If meeting is in the future and within 1 hour, set up refresh
      if (timeUntilMeeting > 0 && timeUntilMeeting < 3600000) {
        const refreshInterval = setInterval(() => {
          refetch();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(refreshInterval);
      }
    }
  }, [meetingData, refetch]);


  const joinEmbeddedMeeting = () => {
    setShowEmbeddedZoom(true);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getMeetingStatus = (startTime: string) => {
    const now = new Date();
    const meetingTime = new Date(startTime);
    const timeDiff = meetingTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (timeDiff < 0) {
      return {
        status: "past",
        text: "This meeting has ended",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    } else if (minutesDiff <= 15) {
      return {
        status: "starting",
        text: "Starting soon",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    } else if (minutesDiff <= 60) {
      return {
        status: "upcoming",
        text: `Starts in ${Math.ceil(minutesDiff)} minutes`,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      };
    } else {
      return {
        status: "scheduled",
        text: "Scheduled",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      };
    }
  };

  // Embedded Zoom Component
  const EmbeddedZoomMeeting = () => {
    // Convert regular Zoom join URL to embedded format
    const getEmbeddedZoomUrl = () => {
      if (!meetingData?.meeting?.joinUrl) return "";

      const url = new URL(meetingData.meeting.joinUrl);
      const meetingNumber = url.pathname.split("/").pop();
      const password = url.searchParams.get("pwd");

      return `https://us05web.zoom.us/wc/join/${meetingNumber}?pwd=${password}`;
    };

    return (
      <div className="fixed inset-0 bg-blue-200/30 bg-opacity-90 z-50 flex items-center justify-center px-4 rounded-2xl ">
        <div className="bg-white rounded-2xl w-full  h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {meetingData?.meeting?.topic}
              </h3>
            </div>
            <button
              onClick={() => setShowEmbeddedZoom(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Zoom Iframe */}
          <div className="flex-1 relative bg-black">
            {!zoomIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg">Loading Zoom Meeting...</p>
                  <p className="text-sm text-gray-300 mt-2">
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

          {/* Footer Controls */}
          {/* <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 text-center md:text-left">
                <span className="font-semibold">Meeting ID:</span>{" "}
                {meetingData?.meeting?.zoomId}
                {meetingData?.meeting?.meetingPassword && (
                  <span className="ml-4">
                    <span className="font-semibold">Password:</span>{" "}
                    {meetingData.meeting.meetingPassword}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={joinMeetingInNewTab}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Open in Zoom App
                </button>
                <button
                  onClick={shareZoomId}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  Share Meeting
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  const meetingStatus = meetingData?.meeting?.startTime
    ? getMeetingStatus(meetingData.meeting.startTime)
    : null;

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Embedded Zoom Modal */}
      {showEmbeddedZoom && <EmbeddedZoomMeeting />}

      <div className="max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Join Meeting</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading meeting details...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-12 px-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Meeting Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                {error?.data?.message ||
                  "The meeting you're looking for doesn't exist or you don't have access."}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}

          {meetingData?.meeting && (
            <div className="p-6 md:p-8 space-y-8">
              {/* Meeting Header */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {meetingData.meeting.topic}
                </h2>

                {/* Meeting Status */}
                {meetingStatus && (
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${meetingStatus.bgColor} ${meetingStatus.color}`}
                  >
                    {meetingStatus.text}
                  </div>
                )}
              </div>

              {/* Meeting Details Card */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Host</p>
                    <p className="text-base text-gray-800">
                      {meetingData.meeting.host?.name || meetingData.meeting.host?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Time</p>
                    <p className="text-base text-gray-800">
                      {formatDateTime(meetingData.meeting.startTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Duration</p>
                    <p className="text-base text-gray-800">
                      {meetingData.meeting.duration} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Zoom ID</p>
                    <p className="text-base text-gray-800 font-mono bg-gray-200 px-3 py-1 rounded inline-block">
                      {meetingData.meeting.zoomId}
                    </p>
                  </div>
                </div>

                {meetingData.meeting.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-base text-gray-800 whitespace-pre-wrap">
                      {meetingData.meeting.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="">
                  <button
                    onClick={joinEmbeddedMeeting}
                    disabled={meetingStatus?.status === "past"}
                    className="bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                  >
                    <span className="mr-3 text-2xl">📹</span>
                    Join in Browser
                  </button>
                      {meetingData.status === "read" ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          Read{" "}
                          {meetingData.readAt &&
                            `on ${new Date(meetingData.readAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAcknowledge(meetingData.meeting._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
                        size="sm"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Mark Attendance
                      </Button>
                    )}
                </div>
              </div>

              {/* Meeting Info Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  {meetingStatus?.status === "past"
                    ? "This meeting has already ended."
                    : 'Choose "Join in Browser" to join directly in this window'}
                </p>

                {/* Meeting Credentials */}
                {/* <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    Manual Join Information
                  </p>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>
                      Meeting ID:{" "}
                      <span className="font-mono bg-yellow-100 px-3 py-1 rounded">
                        {meetingData.meeting.zoomId}
                      </span>
                    </p>
                    <p>
                      Password:{" "}
                      <span className="font-mono bg-yellow-100 px-3 py-1 rounded">
                        {meetingData.meeting.meetingPassword}
                      </span>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Having trouble? <a href="#" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}