// image-utils.ts
import imageCompression from 'browser-image-compression';

/**
 * Hàm nén ảnh dùng browser-image-compression
 * @param file File ảnh gốc từ input[type="file"]
 * @param maxSizeMB Giới hạn kích thước sau khi nén (MB)
 * @param maxWidthOrHeight Chiều rộng hoặc chiều cao tối đa
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
  console.log('📷 Original image size:', originalSizeMB, 'MB');

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const compressedSizeMB = (compressedBlob.size / 1024 / 1024).toFixed(2);
    console.log('✅ Compressed image size:', compressedSizeMB, 'MB');

    // Lấy đuôi file gốc
    const extension = file.name.split('.').pop() || 'jpg';
    const newFileName = `compressed_${Date.now()}.${extension}`;

    // Tạo lại File với tên mới
    const compressedFile = new File([compressedBlob], newFileName, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    console.error('Lỗi khi nén ảnh:', error);
    return file; // fallback nếu lỗi
  }
}
