"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { signOut } from "next-auth/react";
import BackDrop from "./BackDrop";
import { useSession } from "next-auth/react";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="relative z-30">
        <div
          className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
          onClick={() => setOpen(!open)}
        >
          <Avatar src={session?.user?.image} />
          <AiFillCaretDown />
        </div>

        {open && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {session && session.user ? (
              <>
                <div>
                  <Link href="/orders">
                    <MenuItem onClick={() => setOpen(!open)}>
                      Your Orders
                    </MenuItem>
                  </Link>

                  <Link href="/admin">
                    <MenuItem onClick={() => setOpen(!open)}>
                      Admin Dashboard
                    </MenuItem>
                  </Link>
                  <hr />
                  <MenuItem
                    onClick={() => {
                      setOpen(!open);
                      signOut();
                    }}
                  >
                    LogOut
                  </MenuItem>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Link href="/login">
                    <MenuItem onClick={() => setOpen(!open)}>LogIn</MenuItem>
                  </Link>

                  <Link href="/register">
                    <MenuItem onClick={() => setOpen(!open)}>Register</MenuItem>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {open && <BackDrop onClick={() => setOpen(!open)} />}
    </>
  );
};

export default UserMenu;
