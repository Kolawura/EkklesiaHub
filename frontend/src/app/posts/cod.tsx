// import { useState } from "react";
// import {
//   Search,
//   Plus,
//   Edit2,
//   Trash2,
//   Eye,
//   Save,
//   X,
//   FileText,
//   Image,
//   Users,
//   Settings,
//   BarChart3,
//   Tag,
//   MessageCircle,
//   Heart,
//   Bookmark,
//   Calendar,
//   User,
// } from "lucide-react";

// export default function CMSDashboard() {
//   const [activeView, setActiveView] = useState("posts");
//   const [showEditor, setShowEditor] = useState(false);
//   const [showPublicView, setShowPublicView] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [editingPost, setEditingPost] = useState(null);

//   const [posts, setPosts] = useState([
//     {
//       id: "1",
//       title: "Getting Started with Next.js",
//       slug: "getting-started-nextjs",
//       content:
//         "Next.js is a powerful React framework that makes building full-stack applications a breeze. In this comprehensive guide, we'll explore the fundamentals of Next.js and how to leverage its features for building modern web applications.\n\nNext.js provides an excellent developer experience with features like automatic code splitting, optimized performance, and built-in routing. Whether you're building a simple blog or a complex web application, Next.js has you covered.",
//       coverImage:
//         "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//       status: "PUBLISHED",
//       author: { name: "John Doe", id: "user1" },
//       authorId: "user1",
//       tags: [
//         { id: "t1", name: "Next.js" },
//         { id: "t2", name: "React" },
//       ],
//       comments: [],
//       reactions: [],
//       createdAt: "2024-10-10T10:00:00Z",
//       updatedAt: "2024-10-10T10:00:00Z",
//     },
//     {
//       id: "2",
//       title: "Modern Web Design Trends",
//       slug: "modern-web-design-trends",
//       content:
//         "The web design landscape is constantly evolving. Let's explore the latest trends that are shaping how we build beautiful and functional websites in 2024.",
//       coverImage:
//         "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
//       status: "DRAFT",
//       author: { name: "Jane Smith", id: "user2" },
//       authorId: "user2",
//       tags: [
//         { id: "t3", name: "Design" },
//         { id: "t4", name: "UI/UX" },
//       ],
//       comments: [],
//       reactions: [],
//       createdAt: "2024-10-12T14:30:00Z",
//       updatedAt: "2024-10-12T14:30:00Z",
//     },
//     {
//       id: "3",
//       title: "Building Scalable APIs",
//       slug: "building-scalable-apis",
//       content:
//         "Learn how to design and build APIs that can scale to millions of users. We'll cover best practices, architecture patterns, and performance optimization techniques.",
//       coverImage:
//         "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
//       status: "PUBLISHED",
//       author: { name: "John Doe", id: "user1" },
//       authorId: "user1",
//       tags: [
//         { id: "t5", name: "API" },
//         { id: "t6", name: "Backend" },
//       ],
//       comments: [],
//       reactions: [],
//       createdAt: "2024-10-14T09:15:00Z",
//       updatedAt: "2024-10-14T09:15:00Z",
//     },
//   ]);

//   const navItems = [
//     { id: "posts", icon: FileText, label: "Posts" },
//     { id: "media", icon: Image, label: "Media" },
//     { id: "users", icon: Users, label: "Users" },
//     { id: "analytics", icon: BarChart3, label: "Analytics" },
//     { id: "settings", icon: Settings, label: "Settings" },
//   ];

//   const handleEdit = (post) => {
//     setEditingPost(post);
//     setShowEditor(true);
//     setShowPublicView(false);
//   };

//   const handleDelete = (id) => {
//     setPosts(posts.filter((p) => p.id !== id));
//   };

//   const handleSave = () => {
//     setShowEditor(false);
//     setEditingPost(null);
//   };

//   const handleViewPost = (post) => {
//     setSelectedPost(post);
//     setShowPublicView(true);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getActiveIcon = () => {
//     const item = navItems.find((i) => i.id === activeView);
//     return item ? item.icon : FileText;
//   };

//   const ActiveIcon = getActiveIcon();

//   // Public Posts List Component
//   const PublicPostsList = () => {
//     const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");

//     return (
//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//           <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
//             </div>
//             <button
//               onClick={() => setShowPublicView(false)}
//               className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </header>

//         <main className="max-w-6xl mx-auto px-6 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {publishedPosts.map((post) => (
//               <article
//                 key={post.id}
//                 className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => handleViewPost(post)}
//               >
//                 {post.coverImage && (
//                   <div className="aspect-video bg-gray-200 overflow-hidden">
//                     <img
//                       src={post.coverImage}
//                       alt={post.title}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
//                 )}
//                 <div className="p-6">
//                   <div className="flex items-center gap-2 mb-3">
//                     {post.tags.slice(0, 2).map((tag) => (
//                       <span
//                         key={tag.id}
//                         className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
//                       >
//                         {tag.name}
//                       </span>
//                     ))}
//                   </div>

//                   <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
//                     {post.title}
//                   </h2>

//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                     {post.content}
//                   </p>

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
//                         {post.author.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {post.author.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {formatDate(post.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </main>
//       </div>
//     );
//   };

//   // Single Post View Component
//   const SinglePostView = () => {
//     if (!selectedPost) return null;

//     return (
//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//           <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
//             <button
//               onClick={() => setSelectedPost(null)}
//               className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               ← Back to Posts
//             </button>
//             <div className="flex items-center gap-2">
//               <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <Heart size={20} />
//               </button>
//               <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <Bookmark size={20} />
//               </button>
//             </div>
//           </div>
//         </header>

//         <article className="max-w-4xl mx-auto px-6 py-12">
//           {selectedPost.coverImage && (
//             <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-8">
//               <img
//                 src={selectedPost.coverImage}
//                 alt={selectedPost.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}

//           <div className="flex items-center gap-2 mb-4">
//             {selectedPost.tags.map((tag) => (
//               <span
//                 key={tag.id}
//                 className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"
//               >
//                 {tag.name}
//               </span>
//             ))}
//           </div>

//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//             {selectedPost.title}
//           </h1>

//           <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//               {selectedPost.author.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-gray-900">
//                 {selectedPost.author.name}
//               </p>
//               <div className="flex items-center gap-4 text-sm text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <Calendar size={14} />
//                   {formatDate(selectedPost.createdAt)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="prose prose-lg max-w-none">
//             {selectedPost.content.split("\n").map((paragraph, idx) => (
//               <p key={idx} className="text-gray-700 leading-relaxed mb-4">
//                 {paragraph}
//               </p>
//             ))}
//           </div>

//           <div className="mt-12 pt-8 border-t border-gray-200">
//             <div className="flex items-center gap-4">
//               <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Heart size={20} />
//                 <span className="font-medium">Like</span>
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <MessageCircle size={20} />
//                 <span className="font-medium">Comment</span>
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bookmark size={20} />
//                 <span className="font-medium">Save</span>
//               </button>
//             </div>
//           </div>
//         </article>
//       </div>
//     );
//   };

//   if (showPublicView && !selectedPost) {
//     return <PublicPostsList />;
//   }

//   if (selectedPost) {
//     return <SinglePostView />;
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-6 border-b border-gray-200">
//           <h1 className="text-2xl font-bold text-gray-900">CMS</h1>
//           <p className="text-sm text-gray-500 mt-1">Content Management</p>
//         </div>

//         <nav className="flex-1 p-4">
//           {navItems.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveView(item.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
//                   activeView === item.id
//                     ? "bg-blue-50 text-blue-600"
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 <IconComponent size={20} />
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={() => setShowPublicView(true)}
//             className="w-full mb-3 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
//           >
//             View Public Site
//           </button>
//           <div className="flex items-center gap-3 px-4 py-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//               JD
//             </div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-gray-900">John Doe</p>
//               <p className="text-xs text-gray-500">Admin</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white border-b border-gray-200 px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-900 capitalize">
//                 {activeView}
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Manage your {activeView}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowEditor(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus size={20} />
//                 <span>New Post</span>
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-auto p-8">
//           {activeView === "posts" && !showEditor && (
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Title
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Author
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Tags
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {posts.map((post) => (
//                     <tr
//                       key={post.id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">
//                           {post.title}
//                         </div>
//                         <div className="text-sm text-gray-500">{post.slug}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             post.status === "PUBLISHED"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {post.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {post.author.name}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-1">
//                           {post.tags.slice(0, 2).map((tag) => (
//                             <span
//                               key={tag.id}
//                               className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
//                             >
//                               {tag.name}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {formatDate(post.createdAt)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleEdit(post)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <Edit2 size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleViewPost(post)}
//                             className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//                             title="View"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(post.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {activeView === "posts" && showEditor && (
//             <div className="bg-white rounded-xl border border-gray-200 p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editingPost ? "Edit Post" : "New Post"}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowEditor(false);
//                     setEditingPost(null);
//                   }}
//                   className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue={editingPost?.title || ""}
//                     placeholder="Enter post title..."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Slug
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue={editingPost?.slug || ""}
//                     placeholder="post-url-slug"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Cover Image URL
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue={editingPost?.coverImage || ""}
//                     placeholder="https://example.com/image.jpg"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Content
//                   </label>
//                   <textarea
//                     rows={12}
//                     defaultValue={editingPost?.content || ""}
//                     placeholder="Write your content here..."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Status
//                     </label>
//                     <select
//                       defaultValue={editingPost?.status || "DRAFT"}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="DRAFT">Draft</option>
//                       <option value="PUBLISHED">Published</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Tags
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Comma separated tags"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={() => {
//                       setShowEditor(false);
//                       setEditingPost(null);
//                     }}
//                     className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <Save size={18} />
//                     <span>Save Post</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeView !== "posts" && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="text-gray-400 mb-4">
//                   <ActiveIcon size={64} className="mx-auto" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
//                   {activeView}
//                 </h3>
//                 <p className="text-gray-500">This section is coming soon</p>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
