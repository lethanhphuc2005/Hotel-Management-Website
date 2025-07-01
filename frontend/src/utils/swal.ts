// src/components/alerts/CustomSwal.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
export const CustomSwal = Swal.mixin({
  buttonsStyling: false,
  background: "rgba(15, 15, 15, 0.95)", // Đậm hơn 1 chút
  color: "#e0e0e0", // Màu chữ dịu nhẹ
  customClass: {
    popup:
      "tw-rounded-2xl tw-shadow-xl tw-backdrop-blur-md tw-border tw-border-primary tw-px-6 tw-py-6 tw-w-[90%] sm:tw-max-w-md tw-bg-black/80",

    title:
      "tw-text-2xl tw-font-bold tw-text-primary tw-text-center tw-mb-3 tw-leading-tight",
    htmlContainer:
      "tw-text-sm tw-text-center tw-text-gray-300 tw-mb-4 tw-leading-relaxed",

    confirmButton:
      "tw-bg-primary tw-text-black tw-font-semibold tw-px-5 tw-py-2 tw-rounded-lg hover:tw-bg-[#e0a918] focus:tw-ring-2 focus:tw-ring-[#e0a918] focus:tw-ring-offset-2",

    cancelButton:
      "tw-bg-gray-600 tw-text-white tw-font-semibold tw-px-5 tw-py-2 tw-rounded-lg hover:tw-bg-gray-700 focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2",

    actions: "tw-flex tw-justify-center tw-gap-4 tw-mt-5",
    input:
      "tw-w-full tw-h-32 tw-p-3 tw-rounded-lg tw-bg-gray-800 tw-text-white tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary",
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

export const showTextareaInputDialog = async (
  title: string,
  inputLabel: string,
  placeholder: string = "",
  confirmButtonText: string = "Xác nhận",
  cancelButtonText: string = "Huỷ"
) => {
  const result = await CustomSwal.fire({
    title,
    input: "textarea",
    inputLabel,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    preConfirm: (value) => {
      if (!value) {
        CustomSwal.showValidationMessage("Vui lòng nhập thông tin");
      }
      return value;
    },
  });

  return result.isConfirmed ? result.value : null;
};

export const showNumberInputDialog = async (
  title: string,
  inputLabel: string,
  placeholder: string = "",
  confirmButtonText: string = "Xác nhận",
  cancelButtonText: string = "Huỷ"
) => {
  const result = await CustomSwal.fire({
    title,
    input: "number",
    inputLabel,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    preConfirm: (value) => {
      if (value === null || value === "") {
        CustomSwal.showValidationMessage("Vui lòng nhập số tiền");
      } else if (isNaN(value) || value <= 0) {
        CustomSwal.showValidationMessage("Số tiền phải là một số dương");
      }
      return value;
    },
  });

  return result.isConfirmed ? result.value : null;
}
