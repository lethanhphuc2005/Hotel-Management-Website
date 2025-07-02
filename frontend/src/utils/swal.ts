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
};

export const showPaymentMethodDialog = async (): Promise<string | null> => {
  const methods = [
    {
      label: "Thanh toán qua ZaloPay",
      value: "zalopay",
      icon: "/img/zalopay.png",
    },
    {
      label: "Thanh toán qua Momo",
      value: "momo",
      icon: "/img/momo.png",
    },
    {
      label: "Thanh toán qua VNPAY",
      value: "vnpay",
      icon: "/img/vnpay.jpg",
    },
  ];

  return new Promise((resolve) => {
    CustomSwal.fire({
      title: "Chọn phương thức thanh toán",
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${methods
            .map(
              (m) => `
            <button 
              class="payment-method-btn" 
              data-method="${m.value}" 
              style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 16px;
                background: #222;
                border: 1px solid #444;
                border-radius: 10px;
                cursor: pointer;
                color: #fff;
                font-size: 14px;
              "
            >
              <img src="${m.icon}" alt="${m.label}" style="width: 32px; height: 32px;" />
              ${m.label}
            </button>
          `
            )
            .join("")}
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Huỷ",
      willOpen: () => {
        const buttons = document.querySelectorAll<HTMLButtonElement>(
          ".payment-method-btn"
        );
        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const method = btn.getAttribute("data-method");
            CustomSwal.close();
            resolve(method); // ✅ Trả về phương thức được chọn
          });
        });
      },
      didClose: () => {
        resolve(null); // ✅ Người dùng đóng modal hoặc bấm Huỷ
      },
    });
  });
};
