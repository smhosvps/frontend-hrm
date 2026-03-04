/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDeleteMeetingMutation,
  useGetAdminMeetingsQuery,
} from "@/redux/features/zoomApi/zoomApi";
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminMeetingsDashboard = () => {
  const {
    data: meetingsData,
    isLoading,
    refetch,
  } = useGetAdminMeetingsQuery({});
  const [deleteMeeting] = useDeleteMeetingMutation();
  const [copiedField, setCopiedField] = useState<string | null>(null);


  const handleDeleteMeeting = async (meetingId: string) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await deleteMeeting(meetingId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete meeting:", error);
      }
    }
  };

  const handleStartMeeting = (startUrl: string) => {
    window.open(startUrl, "_blank");
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      
      // Reset the copied indicator after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
      
      // Optional: Show a more sophisticated toast instead of alert
      console.log(`${field} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMeetingStatus = (startTime: string, status: string) => {
    const now = new Date();
    const meetingTime = new Date(startTime);
    
    if (status !== 'scheduled') return status;
    
    if (meetingTime < now) return 'ended';
    if ((meetingTime.getTime() - now.getTime()) < 15 * 60 * 1000) return 'starting soon';
    return 'scheduled';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'starting soon':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const meetings = meetingsData?.meetings || [];

  return (
    <div className="min-h-screen p-0 md:p-6">
      <div className="">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                Meeting Management
              </CardTitle>
              <CardDescription className="mt-2 text-lg">
                Create and manage your Zoom meetings for live classes
              </CardDescription>
            </div>

            <Link to="/dashboard/create-zoom-meetings">
              <button className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[10px] transition-all duration-200 transform hover:scale-105 shadow-md">
                + Create New Meeting
              </button>
            </Link>
          </div>
        </CardHeader>

             {/* Summary Stats */}
        {meetings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{meetings.length}</div>
              <div className="text-sm text-gray-600">Total Meetings</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {meetings.filter((m: any) => getMeetingStatus(m.startTime, m.status) === 'scheduled' || getMeetingStatus(m.startTime, m.status) === 'starting soon').length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">
                {meetings.filter((m: any) => getMeetingStatus(m.startTime, m.status) === 'ended').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {meetings.reduce((total: number, meeting: any) => total + (meeting.participants?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
          </div>
        )}

        {meetings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Meetings Scheduled
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first meeting to host live classes with your students.
            </p>
            <Link to="/dashboard/create-zoom-meetings">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[10px] transition-colors">
                Create Your First Meeting
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-6">
            {meetings.map((meeting: any) => {
              const currentStatus = getMeetingStatus(meeting.startTime, meeting.status);
              
              return (
                <div
                  key={meeting._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Header with Status */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-2">
                        {meeting.topic}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentStatus)}`}>
                        {currentStatus.toUpperCase()}
                      </span>
                    </div>
                    
                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {meeting.description}
                      </p>
                    )}
                  </div>

                  {/* Meeting Details */}
                  <div className="p-6 space-y-4">
                    {/* Time and Duration */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-900 font-medium">
                        {formatDateTime(meeting.startTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-900 font-medium">
                        {meeting.duration} minutes
                      </span>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Participants:</span>
                      <span className="text-gray-900 font-medium">
                        {meeting.participants?.length || 0} registered
                      </span>
                    </div>

                    {/* Zoom Meeting ID - Copyable */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-800">Zoom Meeting ID</span>
                        <button
                          onClick={() => copyToClipboard(meeting.zoomMeetingId, `zoomId-${meeting._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                        >
                          {copiedField === `zoomId-${meeting._id}` ? (
                            <>
                              <span>✅</span>
                              Copied!
                            </>
                          ) : (
                            <>
                              <span>📋</span>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded">
                          {meeting.zoomMeetingId}
                        </code>
                      </div>
                    </div>

                    {/* Meeting Password - Copyable */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-green-800">Meeting Password</span>
                        <button
                          onClick={() => copyToClipboard(meeting.meetingPassword, `password-${meeting._id}`)}
                          className="text-green-600 hover:text-green-800 text-xs font-medium flex items-center gap-1"
                        >
                          {copiedField === `password-${meeting._id}` ? (
                            <>
                              <span>✅</span>
                              Copied!
                            </>
                          ) : (
                            <>
                              <span>📋</span>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-green-900 bg-green-100 px-2 py-1 rounded">
                          {meeting.meetingPassword}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 space-y-3">
                    {/* Primary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStartMeeting(meeting.startUrl)}
                        disabled={currentStatus === 'ended' || currentStatus === 'cancelled'}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🎥</span>
                        Start Meeting
                      </button>

                      <button
                        onClick={() => copyToClipboard(meeting.joinUrl, `joinUrl-${meeting._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedField === `joinUrl-${meeting._id}` ? (
                          <>
                            <span>✅</span>
                            Copied!
                          </>
                        ) : (
                          <>
                            <span>🔗</span>
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => copyToClipboard(meeting.zoomMeetingId, `zoomId-full-${meeting._id}`)}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedField === `zoomId-full-${meeting._id}` ? (
                          <>
                            <span>✅</span>
                            ID Copied
                          </>
                        ) : (
                          <>
                            <span>📋</span>
                            Copy ID Only
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteMeeting(meeting._id)}
                        className="border border-red-600 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>

                    {/* Quick Share Info */}
                    <div className="text-center pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Created: {new Date(meeting.createdAt).toLocaleDateString()}
                      </p>
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
};

export default AdminMeetingsDashboard;