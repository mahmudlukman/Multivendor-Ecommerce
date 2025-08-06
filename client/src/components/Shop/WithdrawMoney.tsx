import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteWithdrawMethodMutation,
  useUpdateWithdrawMethodMutation,
} from "../../redux/features/shop/shopApi";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { SellerState, ServerError } from "../../types";
import { useCreateWithdrawRequestMutation } from "../../redux/features/withdraw/withdrawApi";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  const [withdrawMethod, setWithdrawMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  // RTK Query hooks
  const [updateWithdrawMethod, { isLoading: isUpdatingPayment }] =
    useUpdateWithdrawMethodMutation();
  const [deleteWithdrawMethod, { isLoading: isDeletingMethod }] =
    useDeleteWithdrawMethodMutation();
  const [createWithdrawRequest, { isLoading: isCreatingWithdraw }] =
    useCreateWithdrawRequestMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    if (
      !bankInfo.bankName ||
      !bankInfo.bankCountry ||
      !bankInfo.bankSwiftCode ||
      !bankInfo.bankAccountNumber ||
      !bankInfo.bankHolderName ||
      !bankInfo.bankAddress
    ) {
      toast.error("All fields are required!");
      return;
    }

    const withdrawMethodData = {
      withdrawMethod: {
        bankName: bankInfo.bankName,
        bankCountry: bankInfo.bankCountry,
        bankSwiftCode: bankInfo.bankSwiftCode,
        bankAccountNumber: bankInfo.bankAccountNumber,
        bankHolderName: bankInfo.bankHolderName,
        bankAddress: bankInfo.bankAddress,
      },
    };

    try {
      await updateWithdrawMethod(withdrawMethodData).unwrap();
      toast.success("Withdraw method added successfully!");
      setWithdrawMethod(false);
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update withdraw method!";
      toast.error(errorMessage);
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteWithdrawMethod({}).unwrap(); // No need for ID since it uses req.seller._id
      toast.success("Withdraw method deleted successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete withdraw method!";
      toast.error(errorMessage);
    }
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > Number(availableBalance)) {
      toast.error("You can't withdraw this amount!");
    } else {
      try {
        await createWithdrawRequest(withdrawAmount).unwrap();
        toast.success("Withdraw money request is successful!");
      } catch (err: unknown) {
        const serverError = err as ServerError;
        const errorMessage =
          serverError.data?.message ||
          serverError.message ||
          "Failed to create withdraw request!";
        toast.error(errorMessage);
      }
    }
  };

  const availableBalance = Number(seller?.availableBalance) || 0;

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Available Balance: ₦{availableBalance}
        </h5>
        <div
          className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white !h-[42px] !rounded'
          onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${
              withdrawMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => {
                  setOpen(false);
                  setWithdrawMethod(false);
                }}
                className="cursor-pointer"
              />
            </div>
            {withdrawMethod ? (
              <div>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Add new Withdraw Method:
                </h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter your Bank name!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank Country!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your Bank Swift Code!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Bank Account Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" // Changed to text to handle alphanumeric account numbers
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter your bank Holder name!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter your bank address!"
                      className='w-full border p-1 rounded-[5px] mt-2'
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingPayment}
                    className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mb-3 text-white ${
                      isUpdatingPayment ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isUpdatingPayment ? "Adding..." : "Add"}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-[22px] font-Poppins">
                  Available Withdraw Methods:
                </h3>
                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(
                            seller?.withdrawMethod.bankAccountNumber.length - 3
                          ) +
                            seller?.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller?.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className={`cursor-pointer ${
                            isDeletingMethod
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => !isDeletingMethod && deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Available Balance: ₦{availableBalance}</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded"
                      />
                      <div
                        className={`w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !h-[42px] text-white ${
                          isCreatingWithdraw
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => !isCreatingWithdraw && withdrawHandler()}
                      >
                        {isCreatingWithdraw ? "Processing..." : "Withdraw"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[18px] pt-2">
                      No Withdraw Methods available!
                    </p>
                    <div className="w-full flex items-center">
                      <div
                        className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-[#fff] text-[18px] mt-4'
                        onClick={() => setWithdrawMethod(true)}
                      >
                        Add new
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;