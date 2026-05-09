import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export const uploadFile = async (file, path) => {
  if (!storage) {
    const err = new Error("Firebase Storage is not configured in this deployment");
    err.code = "storage/not-configured";
    throw err;
  }
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const uploadHazardPhoto = async (file, reportId) => {
  const filename = `${Date.now()}_${file.name}`;
  const path = `hazard-reports/${reportId}/${filename}`;
  return uploadFile(file, path);
};

export const uploadBlogImage = async (file) => {
  const filename = `${Date.now()}_${file.name}`;
  const path = `blog-images/${filename}`;
  return uploadFile(file, path);
};
