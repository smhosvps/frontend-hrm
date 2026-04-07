/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Trash2, Edit2, Eye } from "lucide-react";
import { useGetUsersQuery } from "@/redux/features/user/userApi";
import { Query, useCreateQueryMutation, useDeleteQueryMutation, useGetQueriesQuery, useUpdateQueryMutation } from "@/redux/features/querriesApi/querriesApi";

export function QueryManager() {
  const { data: users = [] } = useGetUsersQuery({}); // fetch all users
  const { data: queries = [], refetch } = useGetQueriesQuery();
  const [createQuery] = useCreateQueryMutation();
  const [updateQuery] = useUpdateQueryMutation();
  const [deleteQuery] = useDeleteQueryMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const [viewQuery, setViewQuery] = useState<Query | null>(null);

  const handleCreate = async () => {
    if (!selectedUser || !title || !content) return;
    await createQuery({ user: selectedUser, title, content });
    setSelectedUser("");
    setTitle("");
    setContent("");
    refetch();
  };

  const handleUpdate = async () => {
    if (!editingQuery) return;
    await updateQuery({
      id: editingQuery._id,
      data: {
        title: editingQuery.title,
        content: editingQuery.content,
        status: editingQuery.status,
        response: editingQuery.response,
      },
    });
    setEditingQuery(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteQuery(id);
      refetch();
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">Manage User Queries</h2>

      {/* Create Query Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold">Send New Query</h3>
        <div className="grid gap-4">
          <div>
            <Label>Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {users.map((u:any) => (
                  <SelectItem key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Query subject"
            />
          </div>
          <div>
            <Label>Message (Rich Text)</Label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-48 mb-12"
            />
          </div>
          <Button onClick={handleCreate} className="bg-blue-600 text-white rounded-[6px]">
            Send Query
          </Button>
        </div>
      </div>

      {/* List All Queries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">All Queries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Created</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q._id} className="border-t">
                  <td className="px-4 py-2">
                    {q.user.firstName} {q.user.lastName}
                  </td>
                  <td className="px-4 py-2">{q.title}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        q.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : q.status === "responded"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => setViewQuery(q)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => setEditingQuery(q)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingQuery} onOpenChange={() => setEditingQuery(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit Query</DialogTitle>
          </DialogHeader>
          {editingQuery && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingQuery.title}
                  onChange={(e) =>
                    setEditingQuery({ ...editingQuery, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Content (Rich Text)</Label>
                <ReactQuill
                  theme="snow"
                  value={editingQuery.content}
                  onChange={(content) =>
                    setEditingQuery({ ...editingQuery, content })
                  }
                  modules={modules}
                  className="h-48 mb-12"
                />
              </div>
              <div>
                <Label>Response (if any)</Label>
                <Textarea
                  value={editingQuery.response || ""}
                  onChange={(e) =>
                    setEditingQuery({ ...editingQuery, response: e.target.value })
                  }
                  placeholder="User response..."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingQuery.status}
                  onValueChange={(status: any) =>
                    setEditingQuery({ ...editingQuery, status })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewQuery} onOpenChange={() => setViewQuery(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>{viewQuery?.title}</DialogTitle>
          </DialogHeader>
          {viewQuery && (
            <div className="space-y-4">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewQuery.content }}
              />
              {viewQuery.response && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold">User Response:</h4>
                  <p className="text-gray-700">{viewQuery.response}</p>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Status: {viewQuery.status} | Created:{" "}
                {new Date(viewQuery.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}