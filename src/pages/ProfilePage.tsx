import { useAuth } from "../auth/AuthContext";
import { formatDateTime } from "../utils/date";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Profile</h1>
      <section className="card divide-y divide-line">
        <div className="flex justify-between gap-4 p-5"><span className="text-muted">Username</span><span className="font-semibold">{user?.username ?? "—"}</span></div>
        <div className="flex justify-between gap-4 p-5"><span className="text-muted">Email</span><span className="break-all font-semibold">{user?.email ?? "—"}</span></div>
        <div className="flex justify-between gap-4 p-5"><span className="text-muted">Member since</span><span className="font-semibold">{user?.createdAt ? formatDateTime(user.createdAt) : "—"}</span></div>
      </section>
      <button type="button" className="btn-ghost" onClick={signOut}>Log out</button>
    </div>
  );
}
