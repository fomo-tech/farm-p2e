import { Request, Response, NextFunction } from "express";
import { domainUpload, port } from "../config";


const uploadService = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Trả về URL của file vừa upload
  res.json({
    secure_url: `${domainUpload}/${req.file.filename}`,
  });
};

export default uploadService;
