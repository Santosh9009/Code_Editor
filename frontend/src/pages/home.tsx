import logo from '../assets/code-cast-high-resolution-logo-transparent.png'
const Home = () => {
  return (
    <div>
      <nav className="bg-black p-6 w-full">
        <div className="flex justify-between items-center">
          <img className='h-4 md:h-7' src={logo} alt="" />
          {/* Add more navigation links here if needed */}
          <button className='bg-slate-300 px-4 py-2 rounded-full font-semibold hover:scale-105 duration-200 hover:bg-white'>Get Started</button>
        </div>
      </nav>
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-black to-blue-900 text-white gap-10 text-center">
        <h1 className="text-6xl font-bold px-5">Code Together, Anytime, Anywhere!</h1>
        <p className="text-lg text-center max-w-5xl mx-auto">Welcome to <span className='text-[#45e7f9]'>CODECAST</span>, where coding becomes a collaborative adventure! Whether you're a solo developer seeking feedback or a team striving for seamless collaboration, we've got you covered.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">Start Coding Together Today!</button>
      </div>
    </div>
  );
};

export default Home;
