"use client";

import styles from "./quanly.module.css";
import { useAuth } from "@/contexts/AuthContext";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, HomeIcon, PencilIcon, StarIcon, ChatBubbleLeftIcon, ArrowRightOnRectangleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IUser } from "../../model/iuser";

// Define interfaces
interface FormData {
  first_name: string;
  email: string;
  phone_number: string;
  address: string;
  subscribed: boolean;
}

interface Booking {
  _id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  check_in_date: string;
  check_out_date: string;
  adult_amount: number;
  child_amount: number;
  booking_status_id: string;
  booking_method_id: string;
  request: string;
  discount_value: number;
  extra_fee: number;
  total_price: number;
  payment_status: string;
  payment_method_id: string;
  cancel_reason: string | null;
  cancel_date: string | null;
  booking_date: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchError {
  message: string;
}

interface BookingResponse {
  message: string;
  data: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Review {
  _id: string;
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  room_class_id: {
    _id: string;
    name: string;
  };
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

// Component: Thông tin tài khoản
const AccountSection = ({ formData, setFormData }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => {
  const { user, token, loading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<FormData>({
    first_name: formData.first_name || "",
    phone_number: formData.phone_number || "",
    address: formData.address || "",
    subscribed: formData.subscribed ?? true,
    email: formData.email || "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = async () => {
    if (!editForm.first_name || !editForm.phone_number || !editForm.address || editForm.subscribed === undefined) {
      setError("Vui lòng điền đầy đủ thông tin người dùng.");
      return;
    }

    if (!validatePhoneNumber(editForm.phone_number)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.");
      return;
    }

    console.log("Token in handleSave:", token);
    console.log("User in handleSave:", user);

    const userId = user?._id;
    if (!userId) {
      setError("User ID không tìm thấy. Vui lòng đăng nhập lại.");
      console.log("User object:", user);
      return;
    }

    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      console.log("Token from useAuth:", token);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/v1/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      console.log("Update response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || response.statusText;
        setError(`Không thể cập nhật: ${errorMessage}`);
        if (response.status === 403) {
          console.error("Lỗi 403:", errorData);
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else {
          console.error("Lỗi API:", response.status, errorData);
        }
        return;
      }

      const updatedData = await response.json();
      console.log("Update response data:", updatedData);
      const userData = updatedData.data || updatedData;
      const newFormData = {
        first_name: userData.first_name || editForm.first_name,
        email: userData.email || editForm.email,
        phone_number: userData.phone_number || editForm.phone_number,
        address: userData.address || editForm.address,
        subscribed: userData.subscribed ?? editForm.subscribed,
      };
      setFormData(newFormData);
      setEditForm(newFormData);

      const updatedUser: IUser = {
        ...user,
        _id: user?._id || "",
        first_name: userData.first_name || editForm.first_name,
        last_name: user?.last_name || "",
        email: userData.email || editForm.email,
        address: userData.address || editForm.address,
        phone_number: userData.phone_number || editForm.phone_number,
        request: user?.request || "",
        status: user?.status ?? true,
        role: user?.role || "user",
        subscribed: userData.subscribed ?? editForm.subscribed,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Đổi thông tin thành công!");
      setTimeout(() => setSuccess(""), 3000);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      console.error("Lỗi Fetch:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
    setEditForm(formData);
  };

  const handleCancel = () => {
    setEditForm(formData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  return (
    <section className={styles.section}>
      <h3>Thông tin cơ bản</h3>
      <div className={styles.profileInfo}>
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.kUFzwD5-mfBV0PfqgI5GrAHaHa?rs=1&pid=ImgDetMain"
          alt="Ảnh đại diện"
          className={styles.avatar}
        />
        <span className={styles.uploadText}>Tải lên ảnh mới</span>
        <span className={styles.removeText}>Xóa</span>
      </div>

      {isEditing ? (
        <>
          <div className={styles.infoRow}>
            <label>Tên</label>
            <input
              type="text"
              name="first_name"
              value={editForm.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.infoRow}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
            />
          </div>
          <div className={styles.infoRow}>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone_number"
              value={editForm.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.infoRow}>
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={editForm.address}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.notificationRow}>
            <input
              type="checkbox"
              name="subscribed"
              checked={editForm.subscribed}
              onChange={handleInputChange}
            />
            <label style={{ marginLeft: "8px" }}>
              Tôi muốn nhận tin tức và ưu đãi đặc biệt
            </label>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <div style={{ marginTop: "10px" }}>
            <button
              className={styles.deleteBtn}
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              className={styles.editBtn}
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.infoRow}>
            <label>Tên</label>
            <input type="text" value={formData.first_name || ''} readOnly />
          </div>
          <div className={styles.infoRow}>
            <label>Email</label>
            <input type="email" value={formData.email} readOnly />
          </div>
          <div className={styles.infoRow}>
            <label>Số điện thoại</label>
            <input type="tel" value={formData.phone_number} readOnly />
          </div>
          <div className={styles.infoRow}>
            <label>Địa chỉ</label>
            <input type="text" value={formData.address} readOnly />
          </div>
          <div className={styles.notificationRow}>
            <input
              type="checkbox"
              checked={formData.subscribed}
              readOnly
            />
            <label style={{ marginLeft: "8px" }}>
              Tôi muốn nhận tin tức và ưu đãi đặc biệt
            </label>
          </div>
          <div style={{ marginTop: "10px" }}>
            <button className={styles.deleteBtn}>
              <TrashIcon className={styles.buttonIcon} />
              Xóa tài khoản
            </button>
            <button
              className={styles.editBtn}
              onClick={handleEdit}
            >
              <PencilIcon className={styles.buttonIcon} />
              Chỉnh sửa
            </button>
          </div>
        </>
      )}
    </section>
  );
};

// Component: Phòng đã đặt
const RoomSection = ({ bookings, error }: { bookings: Booking[]; error?: string }) => (
  <section className={styles.section}>
    <h3>Phòng đã đặt</h3>
    {error && <p className={styles.error}>{error}</p>}
    <ul className={styles.bookedList}>
      {bookings.length === 0 ? (
        <li>Chưa có phòng nào được đặt.</li>
      ) : (
        bookings.map((booking) => (
          <li key={booking._id}>
            {booking.full_name} - Ngày nhận: {new Date(booking.check_in_date).toLocaleDateString()} đến {new Date(booking.check_out_date).toLocaleDateString()} - Tổng giá: {booking.total_price.toLocaleString()} VNĐ
            {booking.request && <p>Yêu cầu: {booking.request}</p>}
          </li>
        ))
      )}
    </ul>
    {error && error.includes("403") && (
      <button
        className={styles.editBtn}
        onClick={() => window.location.href = "/login"}
      >
        Đăng nhập lại
      </button>
    )}
  </section>
);

// Component: Đổi mật khẩu
const ChangeInfoSection = () => {
  const { user, token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu mới không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (!user || !user._id || !token) {
      setError("Bạn chưa đăng nhập hoặc thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    console.log("Dữ liệu gửi từ frontend:", { currentPassword, newPassword, confirmNewPassword });

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/v1/user/change-password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
        setError(errorMessage);
        if (response.status === 403 || response.status === 401) {
          setError("Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
        }
        return;
      }

      setSuccess(data.message || "Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      const error = err as FetchError;
      setError(error.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <h3>Đổi mật khẩu</h3>
      <form onSubmit={handleChangePassword}>
        <div className={styles.infoRow}>
          <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className={styles.infoRow}>
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className={styles.infoRow}>
          <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div style={{ marginTop: "10px" }}>
          <button
            type="submit"
            className={styles.editBtn}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </section>
  );
};

// Component: Trang hồ sơ
const ProfilePage = () => {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    email: "",
    phone_number: "",
    address: "",
    subscribed: true,
  });
  const [bookings, setBookings] = useState<Booking[]>([]); // Thay bookedRooms bằng bookings
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [fetchUserInfoError, setFetchUserInfoError] = useState<string>("");
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push("/login");
    } else {
      setFormData({
        first_name: user.first_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        subscribed: user.subscribed ?? false,
      });

      const fetchUserInfo = async () => {
        if (!user || !token) {
          setFetchUserInfoError("Bạn chưa đăng nhập hoặc thông tin người dùng không hợp lệ.");
          setLoadingUserInfo(false);
          return;
        }

        setLoadingUserInfo(true);
        try {
          console.log("Fetching user info with user._id:", user._id, "and token:", token);
          const response = await fetch(`http://localhost:8000/v1/user/user-info/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response status:", response.status);
          const data = await response.json();
          console.log("Full API response:", data);
          console.log("Bookings:", data.data.bookings);
          console.log("Comments:", data.data.comments);
          console.log("Reviews:", data.data.reviews);

          if (!response.ok) {
            const errorMessage = data.message || "Không thể tải thông tin người dùng.";
            console.log("Error data:", data);
            if (response.status === 403 || response.status === 401) {
              setFetchUserInfoError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
              setFetchUserInfoError(errorMessage);
            }
            return;
          }

          setBookings(data.data.bookings || []);
          setComments(data.data.comments || []);
          setReviews(data.data.reviews || []);
          console.log("Set bookings state:", data.data.bookings || []);
          console.log("Set comments state:", data.data.comments || []);
          console.log("Set reviews state:", data.data.reviews || []);
          setFetchUserInfoError("");
        } catch (err) {
          console.error("Lỗi Fetch user info:", err);
          setFetchUserInfoError("Đã xảy ra lỗi khi tải thông tin người dùng. Vui lòng thử lại.");
        } finally {
          setLoadingUserInfo(false);
        }
      };

      fetchUserInfo();
    }
  }, [user, router, loading, token]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSection formData={formData} setFormData={setFormData} />;
      case "room":
        return <RoomSection bookings={bookings} error={fetchUserInfoError} />;
      case "changeinfo":
        return <ChangeInfoSection />;
      case "reviews":
        return (
          <section className={styles.section}>
            <h3>Đánh giá của bạn</h3>
            {fetchUserInfoError && <p className={styles.error}>{fetchUserInfoError}</p>}
            {loadingUserInfo ? (
              <p>Đang tải đánh giá...</p>
            ) : (
              <ul className={styles.bookedList}>
                {reviews.length === 0 ? (
                  <li>Bạn chưa có đánh giá nào.</li>
                ) : (
                  reviews.map((review) => (
                    <li key={review._id} className={styles.reviewItem}>
                      <p>
                        <strong>{review.room_class_id?.name || "Phòng không xác định"}</strong> - {review.rating} sao
                      </p>
                      <p>{review.content}</p>
                      <p className={styles.reviewDate}>Ngày đánh giá: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))
                )}
              </ul>
            )}
            {fetchUserInfoError && fetchUserInfoError.includes("đăng nhập lại") && (
              <button className={styles.editBtn} onClick={() => window.location.href = "/login"}>
                Đăng nhập lại
              </button>
            )}
          </section>
        );
      case "comments":
        return (
          <section className={styles.section}>
            <h3>Bình luận</h3>
            {fetchUserInfoError && <p className={styles.error}>{fetchUserInfoError}</p>}
            {loadingUserInfo ? (
              <p>Đang tải bình luận...</p>
            ) : (
              <ul className={styles.bookedList}>
                {comments.length === 0 ? (
                  <li>Chưa có bình luận nào.</li>
                ) : (
                  comments.map((comment) => (
                    <li key={comment._id} className={styles.commentItem}>
                      <p>
                        <strong>Phòng không xác định</strong>: {comment.content}
                      </p>
                      <p>Bởi: {comment.user_id ? `${comment.user_id.first_name || "Bạn"} ${comment.user_id.last_name || ""}` : "Bạn"}</p>
                      <p>Ngày tạo: {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Không xác định"}</p>
                    </li>
                  ))
                )}
              </ul>
            )}
            {fetchUserInfoError && fetchUserInfoError.includes("đăng nhập lại") && (
              <button className={styles.editBtn} onClick={() => window.location.href = "/login"}>
                Đăng nhập lại
              </button>
            )}
          </section>
        );
      default:
        return <AccountSection formData={formData} setFormData={setFormData} />;
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <aside className={styles.sidebar}>
          <h2>Cài đặt</h2>
          <ul className={styles.sidebarMenu}>
            <li
              className={activeTab === "account" ? styles.active : ""}
              onClick={() => setActiveTab("account")}
            >
              <UserIcon className={styles.sidebarIcon} />
              Tài khoản
            </li>
            <li
              className={activeTab === "room" ? styles.active : ""}
              onClick={() => setActiveTab("room")}
            >
              <HomeIcon className={styles.sidebarIcon} />
              Phòng
            </li>
            <li
              className={activeTab === "changeinfo" ? styles.active : ""}
              onClick={() => setActiveTab("changeinfo")}
            >
              <PencilIcon className={styles.sidebarIcon} />
              Thay đổi mật khẩu
            </li>
            <li
              className={activeTab === "reviews" ? styles.active : ""}
              onClick={() => setActiveTab("reviews")}
            >
              <StarIcon className={styles.sidebarIcon} />
              Đánh giá
            </li>
            <li
              className={activeTab === "comments" ? styles.active : ""}
              onClick={() => setActiveTab("comments")}
            >
              <ChatBubbleLeftIcon className={styles.sidebarIcon} />
              Bình luận
            </li>
            <li onClick={handleLogout} className={styles.logoutItem}>
              <ArrowRightOnRectangleIcon className={styles.sidebarIcon} />
              Đăng xuất
            </li>
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h2>Cài đặt tài khoản</h2>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;