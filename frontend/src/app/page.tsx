"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  FileText,
  Image,
  Users,
  Settings,
  BarChart3,
} from "lucide-react";
import { useSidebarStore } from "@/store/useSideBarStore";

export default function CMSDashboard() {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const { activeView } = useSidebarStore();

  type Post = {
    id: number;
    title: string;
    status: string;
    author: string;
    date: string;
    views: number;
  };

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with Next.js",
      status: "published",
      author: "John Doe",
      date: "2024-10-10",
      views: 1234,
    },
    {
      id: 2,
      title: "Modern Web Design Trends",
      status: "draft",
      author: "Jane Smith",
      date: "2024-10-12",
      views: 0,
    },
    {
      id: 3,
      title: "Building Scalable APIs",
      status: "published",
      author: "John Doe",
      date: "2024-10-14",
      views: 892,
    },
  ]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  return (
    <main className="flex-1 overflow-auto p-8">
      {activeView === "posts" && !showEditor && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.views}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeView === "posts" && showEditor && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingPost ? "Edit Post" : "New Post"}
            </h3>
            <button
              onClick={() => {
                setShowEditor(false);
                setEditingPost(null);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                defaultValue={editingPost?.title || ""}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                rows={12}
                placeholder="Write your content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Development</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setEditingPost(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                <span>Save Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView !== "posts" && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              {/* <ActiveIcon size={64} className="mx-auto" /> */}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
              {activeView}
            </h3>
            <p className="text-gray-500">This section is coming soon</p>
          </div>
        </div>
      )}
    </main>
  );
}
