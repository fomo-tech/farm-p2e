import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// Thư mục lưu trữ ảnh
const uploadDir = path.join(__dirname, "..", "uploads");

// Đảm bảo thư mục tồn tại, nếu không thì tạo mới
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ file
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Đảm bảo lưu file vào thư mục 'uploads'
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileExtension = path.extname(file.originalname);

    // Nếu là blob và không có tên file, gán một tên mặc định
    if (!file.originalname || file.originalname === "blob") {
      fileExtension = ".png"; // Đặt mặc định là png, có thể thay đổi nếu cần
    }

    // Đặt tên file mới
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// Bộ lọc file để chỉ cho phép hình ảnh
const fileFilter: (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.originalname === "blob") {
    cb(null, true);
  } else {
    cb(new Error("File không hợp lệ! Chỉ chấp nhận các file hình ảnh."));
  }
};

// Khởi tạo multer với cấu hình lưu trữ, bộ lọc file và giới hạn kích thước
const uploadCloud = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20, // Giới hạn kích thước file 2MB
  },
}).single("file"); // Chỉ upload một file với field là 'file'

// Export middleware xử lý upload
export default uploadCloud;
