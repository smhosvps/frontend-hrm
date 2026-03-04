/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateMeetingMutation } from '@/redux/features/zoomApi/zoomApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const roles = ['pastor', 'Super Admin', 'admin staff', 'operatives', 'adhoc'];

const MeetingCreationForm = () => {
  const [createMeeting, { isLoading, isError, error, isSuccess }] = useCreateMeetingMutation<any>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    startTime: '',
    duration: 60,
    targetRoles: [] as string[],
    excludeSuperAdmin: false,
    settings: {
      waitingRoom: true,
      muteOnEntry: true,
      recordMeeting: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMeeting(formData).unwrap();
      navigate("/dashboard/zoom-meetings");
    } catch (err) {
      console.error('Failed to create meeting:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked }: any = e.target;
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl p-6 bg-white rounded-[10px] shadow-lg">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Meetings
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Schedule New Meeting</h2>
        <div className="w-20"></div>
      </div>

      {isSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Meeting created successfully!
        </div>
      )}
      {isError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error?.data?.message || 'Failed to create meeting'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Existing fields: topic, description, startTime, duration */}
        <div>
          <Label htmlFor="topic">Meeting Topic *</Label>
          <input
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter meeting topic"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter meeting description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time *</Label>
            <input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
              min="15"
              max="240"
              className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* New Role Targeting Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">Target Roles</h3>
          <p className="text-sm text-gray-500">Select which user roles can see this meeting.</p>
          <div className="flex flex-wrap gap-4">
            {roles.map(role => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={formData.targetRoles.includes(role)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <Label htmlFor={`role-${role}`} className="text-sm font-normal">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="excludeSuperAdmin"
              checked={formData.excludeSuperAdmin}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, excludeSuperAdmin: checked as boolean }))}
            />
            <Label htmlFor="excludeSuperAdmin" className="text-sm font-normal">
              Exclude Super Admin (even if selected above)
            </Label>
          </div>
        </div>

        {/* Existing settings section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">Meeting Settings</h3>
          {/* waiting room, mute on entry, record meeting checkboxes as before */}
          <div className="flex items-center p-3 bg-gray-50 rounded-[6px]">
            <Checkbox
              id="waitingRoom"
              name="settings.waitingRoom"
              checked={formData.settings.waitingRoom}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, waitingRoom: checked as boolean }
              }))}
            />
            <Label htmlFor="waitingRoom" className="ml-2 text-sm text-gray-700">
              Enable Waiting Room
            </Label>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-[6px]">
            <Checkbox
              id="muteOnEntry"
              name="settings.muteOnEntry"
              checked={formData.settings.muteOnEntry}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, muteOnEntry: checked as boolean }
              }))}
            />
            <Label htmlFor="muteOnEntry" className="ml-2 text-sm text-gray-700">
              Mute participants on entry
            </Label>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-[6px]">
            <Checkbox
              id="recordMeeting"
              name="settings.recordMeeting"
              checked={formData.settings.recordMeeting}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, recordMeeting: checked as boolean }
              }))}
            />
            <Label htmlFor="recordMeeting" className="ml-2 text-sm text-gray-700">
              Record meeting automatically
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-[6px] hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-[6px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Meeting'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingCreationForm;