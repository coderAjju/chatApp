import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } =
    useChatStore();
    const [showOnlineUserOnly, setShowOnlineUserOnly] = useState(false)

  const {onlineUsers} = useAuthStore();

  const filteredUsers = showOnlineUserOnly ? users.filter(user=>onlineUsers.includes(user._id)) : users;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  console.log("onlineUsers ", onlineUsers);
  console.log("users ", users);

  if (isUserLoading) {
    return <SidebarSkeleton />;
  }
  return (
    <aside>
      <div className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex gap-2 items-center">
            <User className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          {/* todo: online filter toggle */}

          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input type="checkbox"
                checked={showOnlineUserOnly}
                onChange={(e)=> setShowOnlineUserOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span>Show only Online</span>
            </label>
            <span className="text-sx text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>

        </div>
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => {
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/images.jpeg"}
                    alt="user.name"
                    className="size-12 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 ring-2 ring-zinc-900 rounded-full" />
                  )}
                </div>

                {/* User info only visible on large screen */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullname}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })}
          {
            filteredUsers.length === 0 && (
              <div className="p-4 text-center text-zinc-500 py-4">
                No online users
              </div>
            )
          }
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
