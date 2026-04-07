/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import {
  useGetQueriesByUserQuery,
  useUpdateQueryMutation,
} from "@/redux/features/querriesApi/querriesApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Send } from "lucide-react";
import "react-quill/dist/quill.snow.css";

export default function MyQueriesPage() {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
  const userId = user?.user?._id || "";

  const {
    data: queries = [],
    isLoading: isLoadingQueries,
    refetch,
  } = useGetQueriesByUserQuery(userId, { skip: !userId });


  const [updateQuery, { isLoading: isUpdating }] = useUpdateQueryMutation();

  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewQuery = (query: any) => {
    setSelectedQuery(query);
    setResponseText(query.response || "");
    setIsDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery) return;
    try {
      await updateQuery({
        id: selectedQuery._id,
        data: {
          response: responseText,
          status: "responded",
        },
      }).unwrap();
      refetch();
      setIsDialogOpen(false);
      setSelectedQuery(null);
      setResponseText("");
    } catch (err) {
      console.error("Failed to update query:", err);
    }
  };

  if (isLoadingUser || (isLoadingQueries && !userId)) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!queries.length) {
    return (
      <div className="py-10 px-0 lg:px-4">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">You have no queries yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "responded":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Responded
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Closed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="py-6">
      <div className="px-0 lg:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          My Queries
        </h1>
        <CardContent className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Received
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query: any) => (
                  <tr key={query._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{query.title}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(query.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuery(query)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>

      {/* View/Respond Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900">
              {selectedQuery?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-6">
              {/* Admin's original query (rich text) */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Admin Message:
                </h4>
                <div
                  className="prose max-w-none border rounded-md p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: selectedQuery.content }}
                />
              </div>

              {/* Existing response if any */}
              {selectedQuery.response && (
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    Your Previous Response:
                  </h4>
                  <div className="border rounded-md p-4 bg-green-50 text-gray-700">
                    {selectedQuery.response}
                  </div>
                </div>
              )}

              {/* Response form (if not closed) */}
              {selectedQuery.status !== "closed" && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {selectedQuery.response
                      ? "Update Your Response"
                      : "Write Your Response"}
                  </h4>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    rows={5}
                    className="mb-4"
                  />
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={isUpdating || !responseText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {selectedQuery.response
                      ? "Update Response"
                      : "Submit Response"}
                  </Button>
                </div>
              )}

              {selectedQuery.status === "closed" && (
                <div className="text-center text-gray-500 italic">
                  This query is closed and cannot be responded to.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
