import { Laptop } from "lucide-react";
import logo from "../assets/code-cast-high-resolution-logo-transparent.png";

const SmallScreenWarning = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="text-center space-y-6">
        <img src={logo} alt="CodeCast Logo" className="h-8 mx-auto mb-8" />
        <div className="flex justify-center">
          <Laptop className="h-16 w-16 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Desktop View Required</h1>
        <p className="text-gray-400 max-w-md">
          CodeCast is optimized for larger screens. Please use a desktop or laptop
          computer for the best experience.
        </p>
        <p className="text-sm text-gray-500">
          Minimum recommended screen width: 768px
        </p>
      </div>
    </div>
  );
};

export default SmallScreenWarning;