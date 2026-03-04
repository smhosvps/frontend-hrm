/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useCreateScheduleMutation,
    useGetAllScheduleQuery,
    useUpdateScheduleMutation,
    useArchiveScheduleMutation,
} from "@/redux/features/schedule/scheduleApi";
import { Loader2, Plus, Edit, Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const roles = ['pastor', 'Super Admin', 'admin staff', 'operatives', 'adhoc'];

export default function ManageSchedule() {
    const [date, setDate] = useState("");
    const [dateError, setDateError] = useState<string | null>(null);
    const [info, setInfo] = useState("");
    const [targetRoles, setTargetRoles] = useState<string[]>([]);
    const [excludeSuperAdmin, setExcludeSuperAdmin] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<"create" | "edit" | "">("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [createSchedule, { data, isSuccess, error, isLoading }]:any = useCreateScheduleMutation();
    const { data: schedulesData, refetch, isLoading: loadingSchedule } = useGetAllScheduleQuery();
    const [updateSchedule, { isLoading: updateLoading }] = useUpdateScheduleMutation();
    const [archiveSchedule] = useArchiveScheduleMutation();

    const schedules = schedulesData?.schedules || [];

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(schedules.length / itemsPerPage);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Schedule created successfully");
            closeModal();
            refetch();
        }
    }, [isSuccess, data?.message, refetch]);

    useEffect(() => {
        if (error && "data" in error) {
            toast.error((error as any).data.message);
        }
    }, [error]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    };

    const openCreateModal = () => {
        setModalType("create");
        setDate("");
        setInfo("");
        setTargetRoles([]);
        setExcludeSuperAdmin(false);
        setSelectedId(null);
        setIsModalOpen(true);
        setDateError(null);
    };

    const openEditModal = (schedule: any) => {
        setModalType("edit");
        setDate(schedule.date.split("T")[0]);
        setInfo(schedule.info);
        setTargetRoles(schedule.targetRoles);
        setExcludeSuperAdmin(schedule.excludeSuperAdmin);
        setSelectedId(schedule._id);
        setIsModalOpen(true);
        setDateError(null);
    };

    const handleArchive = async (id: string) => {
        if (window.confirm("Are you sure you want to archive this schedule? Users will no longer see it.")) {
            try {
                await archiveSchedule(id).unwrap();
                toast.success("Schedule archived successfully");
                refetch();
            } catch (err) {
              console.log(err)
                toast.error("Failed to archive schedule");
            }
        }
    };

    const handleRoleToggle = (role: string) => {
        setTargetRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDateError(null);

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setDateError("Please select a date today or in the future");
            return;
        }

        if (targetRoles.length === 0) {
            toast.error("Please select at least one target role");
            return;
        }

        try {
            if (modalType === "create") {
                await createSchedule({ info, date, targetRoles, excludeSuperAdmin }).unwrap();
            } else if (selectedId) {
                await updateSchedule({ id: selectedId, info, date }).unwrap();
                toast.success("Schedule updated successfully");
                closeModal();
                refetch();
            }
        } catch (err) {
          console.log(err)
            toast.error("An error occurred. Please try again.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType("");
        setSelectedId(null);
        setDate("");
        setInfo("");
        setTargetRoles([]);
        setExcludeSuperAdmin(false);
        setDateError(null);
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
                <h2 className="text-2xl font-bold text-gray-800">Schedules</h2>
                <Button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Create Schedule</span>
                </Button>
            </div>

            {/* Schedule Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {loadingSchedule ? (
                    <div className="p-6 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                        <p className="mt-2">Loading schedules...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Info</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target Roles</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Exclude SA</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stats (R/U/T)</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentSchedules.map((schedule: any, index: number) => (
                                        <tr key={schedule._id}>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {new Date(schedule.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {schedule.info}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {schedule.targetRoles.join(', ')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {schedule.excludeSuperAdmin ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {schedule.stats ? `${schedule.stats.read}/${schedule.stats.unread}/${schedule.stats.total}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {schedule.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 flex gap-2">
                                                <Button
                                                    onClick={() => openEditModal(schedule)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-900 hover:bg-indigo-50"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                {schedule.status === 'active' && (
                                                    <Button
                                                        onClick={() => handleArchive(schedule._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-orange-600 hover:text-orange-900 hover:bg-orange-50"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (same as before) */}
                        <div className="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, schedules.length)} of {schedules.length} entries
                                </span>
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => setItemsPerPage(Number(value))}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Show" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[5, 10, 20].map((size) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                Show {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <span className="px-3 py-1.5 text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalType === "create" ? "Create Schedule" : "Edit Schedule"}
                        </DialogTitle>
                        <DialogDescription>
                            {modalType === "create"
                                ? "Create a new schedule. Select which roles should see it."
                                : "Update the schedule details (roles cannot be changed)."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-4">
                            {/* Date Field */}
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setDateError(null);
                                    }}
                                    required
                                />
                                {dateError && <p className="text-sm text-red-500 mt-1">{dateError}</p>}
                            </div>

                            {/* Information Field */}
                            <div className="space-y-2">
                                <Label htmlFor="info">Information</Label>
                                <Textarea
                                    id="info"
                                    value={info}
                                    onChange={(e) => setInfo(e.target.value)}
                                    maxLength={150}
                                    placeholder="Enter description"
                                    className="h-32 resize-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 text-right">{info.length}/150 characters</p>
                            </div>

                            {/* Target Roles - only shown in create mode */}
                            {modalType === "create" && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Target Roles</Label>
                                        <div className="flex flex-wrap gap-4">
                                            {roles.map(role => (
                                                <div key={role} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`role-${role}`}
                                                        checked={targetRoles.includes(role)}
                                                        onCheckedChange={() => handleRoleToggle(role)}
                                                    />
                                                    <Label htmlFor={`role-${role}`} className="text-sm font-normal">
                                                        {role}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Exclude Super Admin Checkbox */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="excludeSuperAdmin"
                                            checked={excludeSuperAdmin}
                                            onCheckedChange={(checked) => setExcludeSuperAdmin(checked as boolean)}
                                        />
                                        <Label htmlFor="excludeSuperAdmin" className="text-sm font-normal">
                                            Exclude Super Admin (even if selected above)
                                        </Label>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 hover:text-white"
                                disabled={isLoading || updateLoading}
                            >
                                {isLoading || updateLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>{modalType === "create" ? "Creating..." : "Updating..."}</span>
                                    </>
                                ) : modalType === "create" ? (
                                    "Create Schedule"
                                ) : (
                                    "Update Schedule"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}