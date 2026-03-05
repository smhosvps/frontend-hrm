/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMeetingAttendanceQuery,
  useGetMeetingAttendanceStatsQuery,
} from "@/redux/features/zoomApi/zoomApi";
import { useGetAdminMeetingsQuery } from "@/redux/features/zoomApi/zoomApi";
import {
  Loader2,
  Users,
  UserCheck,
  Calendar,
  Clock,
  Check,
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Church,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

const ZoomAttendancePage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attendance");

  // Fetch meeting details
  const { data: meetingsData } = useGetAdminMeetingsQuery({});
  const meeting = meetingsData?.meetings?.find((m: any) => m._id === meetingId);

  

  // Fetch attendance data
  const { data: attendanceData, isLoading: attendanceLoading } = 
    useGetMeetingAttendanceQuery(meetingId, { skip: !meetingId });

    console.log(attendanceData, "attendance data")

  const { data: statsData, isLoading: statsLoading } = 
    useGetMeetingAttendanceStatsQuery(meetingId, { skip: !meetingId });

  const attendees = attendanceData?.data || [];
  const stats = statsData?.data;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExportCSV = () => {
    try {
      // Prepare CSV data
      const csvData = attendees.map((item: any) => ({
        'First Name': item.user.firstName,
        'Last Name': item.user.lastName,
        'Email': item.user.email || 'N/A',
        'Phone': item.user.phone_Number || 'N/A',
        'Role': item.user.role || 'N/A',
        'Department': item.user.department || 'N/A',
        'Church Branch': item.user.church_branch || 'N/A',
        'Attendance Time': new Date(item.attendedAt).toLocaleString(),
      }));

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map((row:any) => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-attendance-${meeting?.topic || meetingId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Attendance data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export attendance data');
    }
  };

  if (attendanceLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 md:px-6">
      {/* Header with Navigation */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="sm"
            className="rounded-[6px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Meeting Attendance
          </h1>
        </div>

        {/* Meeting Summary Card */}
        {meeting && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{meeting.topic}</CardTitle>
              <CardDescription>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(meeting.startTime).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4" />
                    {meeting.duration} minutes
                  </span>
                  {meeting.description && (
                    <span className="text-sm text-gray-600">
                      {meeting.description}
                    </span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invited</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalInvited}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalAttendees}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.totalInvited - stats.totalAttendees}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.attendanceRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Check className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Export Button */}
        {attendees.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleExportCSV}
              className="bg-green-600 hover:bg-green-700 text-white rounded-[6px]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Attendance
            </Button>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="attendance">Attendance List</TabsTrigger>
            <TabsTrigger value="details">Meeting Details</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            {attendees.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 text-lg">No attendance records</p>
                  <p className="text-gray-500 text-sm mt-1">
                    No one has marked attendance for this meeting yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {attendees.map((item: any) => {
                  const user = item.user;
                  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
                  
                  return (
                    <Card key={item.receiptId} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Avatar and Basic Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                              <AvatarImage src={user.avatar?.url} alt={user.firstName} />
                              <AvatarFallback className="bg-blue-500 text-white text-lg">
                                {initials || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {user.role}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  <Check className="w-3 h-3 mr-1" />
                                  Present
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-500 mt-1">
                                Attended: {new Date(item.attendedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* User Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 bg-gray-50 p-4 rounded-lg">
                            {user.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{user.email}</span>
                              </div>
                            )}
                            
                            {user.phone_Number && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{user.phone_Number}</span>
                              </div>
                            )}
                            
                            {user.department && (
                              <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{user.department}</span>
                              </div>
                            )}
                            
                            {user.church_branch && (
                              <div className="flex items-center gap-2 text-sm">
                                <Church className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{user.church_branch}</span>
                              </div>
                            )}
                            
                            {user.address && (
                              <div className="flex items-center gap-2 text-sm sm:col-span-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700 truncate">{user.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="details">
            {meeting && (
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Meeting Topic</p>
                      <p className="text-lg font-semibold">{meeting.topic}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Zoom Meeting ID</p>
                      <p className="text-lg font-mono">{meeting.zoomMeetingId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Time</p>
                      <p>{new Date(meeting.startTime).toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p>{meeting.duration} minutes</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Password</p>
                      <p className="font-mono">{meeting.meetingPassword}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        meeting.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                        meeting.status === 'live' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                  
                  {meeting.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="mt-1">{meeting.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join URL</p>
                    <a 
                      href={meeting.joinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {meeting.joinUrl}
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ZoomAttendancePage;