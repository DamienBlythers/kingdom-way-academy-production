import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: "LEARNER" | "INSTRUCTOR" | "ADMIN";
  createdAt: Date;
  subscriptionStatus: string | null;
}

interface RecentUsersProps {
  users: User[];
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1e3a8f] rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user.name || "Unknown"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              {user.subscriptionStatus === "ACTIVE" && (
                <Badge variant="default" className="bg-green-500">
                  Paid
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}