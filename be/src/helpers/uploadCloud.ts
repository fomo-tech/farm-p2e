import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Thư mục lưu trữ ảnh
const uploadDir = "uploads";

// Đảm bảo thư mục tồn tại, nếu không thì tạo mới
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileExtension = path.extname(file.originalname);

    if (!file.originalname || file.originalname === "blob") {
      fileExtension = ".png"; // mặc định
    }

    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// Bộ lọc file để chỉ cho phép hình ảnh
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/") || file.originalname === "blob") {
    cb(null, true);
  } else {
    cb(new Error("File không hợp lệ! Chỉ chấp nhận các file hình ảnh."));
  }
};

// Khởi tạo multer với cấu hình
const uploadCloud = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
}).single("file");

export default uploadCloud;
