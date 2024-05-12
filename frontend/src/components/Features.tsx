import {motion} from 'framer-motion';
export const Features = () => {
  return (
    <div className=" text-center font-roboto py-10">
      <h1 className="text-white font-medium text-4xl mb-10 md:mb-36">Features</h1>
    <div className="bg-transparent flex justify-center items-center flex-wrap md:flex-nowrap md:pb-36">
      {/* Feature: Real-time Collaboration */}
      <motion.div 
      initial={{ y: 100 ,opacity:0}}
      whileInView={{ y: 0 ,opacity:100}}
      transition={{duration:0.5}}
      whileHover={{ scale: 1.1 }}
      className="max-w-md backdrop-brightness-90 border border-white rounded-lg p-5 md:p-8 m-5 ">
        <h3 className="text-xl font-semibold text-white mb-4">Real-time Collaboration</h3>
        <p className="text-base text-white">
          Collaborate with others in real-time, seeing each other's changes as they happen.
        </p>
      </motion.div>

      {/* Feature: Live Chat */}
      <motion.div 
       initial={{ y: 200 ,opacity:0}}
       whileInView={{ y: 0 ,opacity:100}}
       transition={{duration:0.5}}
       whileHover={{ scale: 1.1 }}
      className="max-w-md  backdrop-brightness-90 border border-white rounded-lg p-5 md:p-8 m-5">
        <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
        <p className="text-base text-white">
          Discuss code with your collaborators using the integrated live chat feature.
        </p>
      </motion.div>

      {/* Feature: Syntax Highlighting */}
      <motion.div 
       initial={{ y: 300 ,opacity:0}}
       whileInView={{ y: 0 ,opacity:100}}
       transition={{duration:0.5}}
       whileHover={{ scale: 1.1 }}
      className="max-w-md backdrop-brightness-90 border border-white rounded-lg p-5 md:p-8 m-5">
        <h3 className="text-xl font-semibold text-white mb-4">Syntax Highlighting</h3>
        <p className="text-base text-white">
          Syntax highlighting for various programming languages to improve code readability.
        </p>
      </motion.div>

      {/* Additional features can be added similarly */}
    </div>
    </div>
  );
};
