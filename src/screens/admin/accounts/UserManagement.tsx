/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useApproveUserMutation,
  useDisapproveUserMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useDeleteUserMutation, // Add this
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Add this import
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  EyeIcon,
  Trash2, // Add this icon
} from "lucide-react";
import { Link } from "react-router-dom";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isAccountApproved: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  avatar?: { url: string };
};

export default function UserManagement() {
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({});
  const [approveUser] = useApproveUserMutation();
  const [disapproveUser] = useDisapproveUserMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();
  const [deleteUser] = useDeleteUserMutation(); // Add delete mutation

  // State for suspension modal
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const users = data?.users || [];

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId).unwrap();
      toast.success("User approved successfully");
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve user");
    }
  };

  const handleDisapprove = async (userId: string) => {
    try {
      await disapproveUser(userId).unwrap();
      toast.success("User approval revoked");
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to disapprove user");
    }
  };

  const openSuspendModal = (user: User) => {
    setSelectedUser(user);
    setSuspendReason("");
    setIsSuspendModalOpen(true);
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    if (!suspendReason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }
    setIsSubmitting(true);
    try {
      await suspendUser({
        userId: selectedUser._id,
        reason: suspendReason,
      }).unwrap();
      toast.success(`User ${selectedUser.firstName} suspended`);
      await refetch();
      setIsSuspendModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to suspend user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsuspend = async (user: User) => {
    try {
      await unsuspendUser(user._id).unwrap();
      toast.success(`User ${user.firstName} unsuspended`);
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to unsuspend user");
    }
  };

  // New delete handlers
  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    // Prevent deleting Super Admin
    if (userToDelete.role === "Super Admin") {
      toast.error("Super Admin cannot be deleted");
      setIsDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success(`User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`);
      await refetch();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-2 justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        <div className="flex gap-2 items-center">
          <Link to="/dashboard/admin-add-account-csv">
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-[6px]"
            >
              <UserX className="h-4 w-4 mr-1" />
              Add users Via CSV
            </Button>
          </Link>
          <Link to="/dashboard/admin-add-account">
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-[6px]"
            >
              <UserX className="h-4 w-4 mr-1" />
              Add user
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">S/N</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar?.url} />
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.isSuspended && (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                    {user.isAccountApproved ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Approved
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Approve/Disapprove */}
                    {!user.isAccountApproved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 rounded-[6px]"
                        onClick={() => handleApprove(user._id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 rounded-[6px]"
                        onClick={() => handleDisapprove(user._id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Disapprove
                      </Button>
                    )}

                    {/* Suspend/Unsuspend */}
                    {!user.isSuspended ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-[6px]"
                        onClick={() => openSuspendModal(user)}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-[6px]"
                        onClick={() => handleUnsuspend(user)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Unsuspend
                      </Button>
                    )}
                    
                    {/* Details Button */}
                    <Link to={`/dashboard/user-details/${user?._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-[6px]"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </Link>

                    {/* Delete Button - Only show for non-Super Admin */}
                    {user.role !== "Super Admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-[6px]"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Suspension Modal */}
      <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
        <DialogContent className="sm:max-w-md bg-white/85">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Please provide a reason for suspending {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Suspension Reason</Label>
              <Input
                id="reason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Violation of policy"
                className="rounded-[6px] text-gray-800 border border-gray-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-[6px]"
              onClick={() => setIsSuspendModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspend}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-[6px]"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This action cannot be undone. This will permanently delete the user account for:
              </p>
              <p className="font-semibold text-gray-900">
                {userToDelete?.firstName} {userToDelete?.lastName} ({userToDelete?.email})
              </p>
              <p className="text-sm text-red-600 mt-2">
                Warning: All data associated with this user will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="rounded-[6px]"
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-[6px]"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}