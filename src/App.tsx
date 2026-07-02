import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import GalleryPage from "@/pages/GalleryPage";
import PostDetailPage from "@/pages/PostDetailPage";
import WritePage from "@/pages/WritePage";
import EditPage from "@/pages/EditPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<GalleryPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route path="users/:id" element={<ProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="write"
          element={
            <RequireAuth>
              <WritePage />
            </RequireAuth>
          }
        />
        <Route
          path="posts/:id/edit"
          element={
            <RequireAuth>
              <EditPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
