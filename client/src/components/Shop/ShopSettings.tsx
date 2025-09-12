import { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import toast from "react-hot-toast";
import { useUpdateShopInfoMutation } from "../../redux/features/shop/shopApi";
import { SellerState, ServerError } from "../../types";

const ShopSettings = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const [updateShopInfo, { isLoading: isUpdatingInfo }] =
    useUpdateShopInfoMutation();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const updateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateShopInfo({
        name,
        address,
        zipCode,
        phoneNumber,
        description,
        avatar,
      }).unwrap();

      toast.success("Shop info updated successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update shop info!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={
                typeof avatar === "string" ? avatar : `${seller?.avatar?.url}`
              }
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileInputChange}
                name="avatar"
                accept=".jpg,.jpeg,.png"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form
          aria-aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateShop}
        >
          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.name}`}
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className='w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0'
              required
              disabled={isUpdatingInfo}
            />
          </div>
          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop description</label>
            </div>
            <input
              type="name"
              placeholder={`${
                seller?.description
                  ? seller.description
                  : "Enter your shop description"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0'
              disabled={isUpdatingInfo}
            />
          </div>
          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="name"
              placeholder={seller?.address}
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              className='w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0'
              required
              disabled={isUpdatingInfo}
            />
          </div>

          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Phone Number</label>
            </div>
            <input
              type="number"
              placeholder={
                seller?.phoneNumber
                  ? String(seller.phoneNumber)
                  : "Enter your phone number"
              }
              value={phoneNumber || ""}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className='w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0'
              required
              disabled={isUpdatingInfo}
            />
          </div>

          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="number"
              placeholder={
                seller?.zipCode ? String(seller.zipCode) : "Enter your zipCode"
              }
              value={zipCode || ""}
              onChange={(e) =>
                setZipcode(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className='w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0'
              required
              disabled={isUpdatingInfo}
            />
          </div>

          <div className="w-full flex items-center flex-col 800px:w-[50%] mt-5">
            <input
              type="submit"
              value={isUpdatingInfo ? "Updating..." : "Update Shop"}
              className={`w-full border p-1 rounded-[5px] w-[95%]! mb-4 800px:mb-0 ${
                isUpdatingInfo ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdatingInfo}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
