// src/components/alerts/CustomSwal.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const CustomSwal = Swal.mixin({
  buttonsStyling: false,
  background: "rgba(20, 20, 20, 0.9)",
  color: "#ccc",
  customClass: {
    popup:
      "tw-rounded-2xl tw-shadow-2xl tw-backdrop-blur-sm tw-border-2 tw-border-[#FAB320] tw-px-8 tw-pt-6 tw-pb-8 tw-w-[95%] tw-max-w-md",

    title: "tw-text-xl tw-font-bold tw-text-[#FAB320] tw-text-center tw-mb-2",
    htmlContainer: "tw-text-sm tw-text-center tw-text-gray-300 tw-mb-4",
    confirmButton:
      "tw-bg-[#FAB320] tw-text-black tw-font-bold tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-[#e0a918]",
    cancelButton:
      "tw-bg-gray-600 tw-text-white tw-font-medium tw-px-6 tw-py-2 tw-rounded-lg hover:tw-bg-gray-700 tw-ml-2",
    actions: "tw-flex tw-justify-center tw-gap-4 tw-mt-4",
  },
});

export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmButtonText: string = "Xác nhận",
  cancelButtonText: string = "Huỷ"
) => {
  const result = await CustomSwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
