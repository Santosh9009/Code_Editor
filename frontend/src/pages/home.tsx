import { Link } from "react-router-dom";
import logo from "../assets/code-cast-high-resolution-logo-transparent.png";
import "./home.css";
import { motion } from "framer-motion";
const Home = () => {
  return (
    <div>
      <nav className="bg-black p-6 w-full">
        <div className="flex justify-between items-center">
          <img className="h-4 md:h-7" src={logo} alt="" />
          {/* Add more navigation links here if needed */}
          <button className="bg-slate-300 px-4 py-2 rounded-full font-semibold hover:scale-105 duration-200 hover:bg-white">
            <Link to={"/auth"}>Get Started</Link>
          </button>
        </div>
      </nav>
      <div className="min-h-screen w-full flex flex-col justify-center items-center text-white gap-10 text-center home">
        <motion.div
          initial={{ y: 100 ,opacity:0}}
          whileInView={{ y: 0 ,opacity:100}}
          transition={{duration:0.6}}
          className="text-2xl md:text-6xl font-semibold px-5 font-roboto gradient-text"
        >
          Code Together, Anytime, Anywhere!
        </motion.div>
        <p className="text-base md:text-lg text-center mx-5 md:max-w-2xl font-sans">
          Welcome to <span className="text-[#45e7f9] font-mono">CODECAST</span>,
          your collaborative coding hub! Conduct interviews, solve doubts, and
          tackle problems together effortlessly.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          <Link to={"/auth"}>Start Coding Together Today!</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
