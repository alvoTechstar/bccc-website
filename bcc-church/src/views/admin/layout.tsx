import { Redirect, Route, Switch, useLocation } from "wouter";
import { AdminShell } from "@/components/layout/admin-layout";
import AdminDashboard from "./dashboard";
import AdminGiving from "./giving";
import AdminMessages from "./messages";
import AdminSubscribers from "./subscribers";
import AdminPosts from "./posts";
import AdminEvents from "./events";
import AdminMedia from "./media";
import AdminUsers from "./users";
import { isSuperAdmin, useAdminAuth } from "@/lib/admin-auth";

const TITLES: { prefix: string; title: string; crumb: string }[] = [
  { prefix: "/admin/giving", title: "Giving transactions", crumb: "Admin / Giving" },
  { prefix: "/admin/messages", title: "Messages", crumb: "Admin / Messages" },
  { prefix: "/admin/subscribers", title: "Subscribers", crumb: "Admin / Subscribers" },
  { prefix: "/admin/posts", title: "Blog posts", crumb: "Admin / Blog posts" },
  { prefix: "/admin/events", title: "Events", crumb: "Admin / Events" },
  { prefix: "/admin/media", title: "Media", crumb: "Admin / Media" },
  { prefix: "/admin/users", title: "Users", crumb: "Admin / Users" },
];

/** Users page is Super Admin only. */
function UsersGate() {
  const { user } = useAdminAuth();
  if (!isSuperAdmin(user)) return <Redirect to="/admin" />;
  return <AdminUsers />;
}

export default function AdminLayout() {
  const [location] = useLocation();
  const { authed } = useAdminAuth();
  if (!authed) return <Redirect to="/admin/login" />;

  const match = TITLES.find((t) => location.startsWith(t.prefix));
  const title = match?.title ?? "Dashboard";
  const crumb = match?.crumb ?? "Admin / Dashboard";

  return (
    <AdminShell title={title} breadcrumb={crumb}>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/giving" component={AdminGiving} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/subscribers" component={AdminSubscribers} />
        <Route path="/admin/posts" component={AdminPosts} />
        <Route path="/admin/events" component={AdminEvents} />
        <Route path="/admin/media" component={AdminMedia} />
        <Route path="/admin/users" component={UsersGate} />
      </Switch>
    </AdminShell>
  );
}
