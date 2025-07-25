"use client";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "100px auto",
};
const LoadingPage = () => {
  return (
    <ClipLoader
      color="#3b82f6"
      size={20}
      aria-label="Loading Spinner"
    />
  );
};

export default LoadingPage;
