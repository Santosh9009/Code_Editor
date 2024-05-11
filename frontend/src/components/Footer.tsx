import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="flex justify-center items-center mb-8">
        <a
          href="https://github.com/Santosh9009"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white mr-4"
        >
          <FaGithub className="text-2xl" />
        </a>
        <a
          href="https://twitter.com/Santosh__Pati"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white mr-4"
        >
          <FaTwitter className="text-2xl" />
        </a>
        <a
          href="https://www.linkedin.com/in/santosh-pati-66888a272/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white"
        >
          <FaLinkedin className="text-2xl" />
        </a>
      </div>
      <p className="text-center text-gray-400 text-sm">
        Made by Santosh. Powered by vite , Tailwind CSS and Monaco-editor.
      </p>
    </footer>
  );
};

export default Footer;
