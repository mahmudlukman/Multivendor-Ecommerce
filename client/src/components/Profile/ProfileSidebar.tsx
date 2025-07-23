import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, ServerError } from "../../types";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";

interface ProfileSidebarProps {
  setActive: (value: number) => void;
  active: number;
}

const ProfileSidebar = ({ setActive, active }: ProfileSidebarProps) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to logout!";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => {
          setActive(4);
          navigate("/user/inbox");
        }}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Inbox
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Track Order
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 6 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Change Password
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 7 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>

      {user && user?.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full mb-8"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings
              size={20}
              color={active === 7 ? "red" : ""}
            />
            <span
              className={`pl-3 ${
                active === 8 ? "text-[red]" : ""
              } 800px:block hidden`}
            >
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}
      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={handleLogout}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 8 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
