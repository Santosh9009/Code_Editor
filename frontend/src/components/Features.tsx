export const Features = () => {
  return (
    <div className="h-screen text-center font-roboto">
      <h1 className="text-white font-medium text-3xl">Features</h1>
    <div className="h-full bg-transparent flex justify-center items-center flex-wrap md:flex-nowrap pb-36">
      {/* Feature: Real-time Collaboration */}
      <div className="max-w-md bg-transparent border border-white rounded-lg p-8 mx-5">
        <h3 className="text-xl font-semibold text-white mb-4">Real-time Collaboration</h3>
        <p className="text-base text-white">
          Collaborate with others in real-time, seeing each other's changes as they happen.
        </p>
      </div>

      {/* Feature: Live Chat */}
      <div className="max-w-md  backdrop-brightness-90 border border-white rounded-lg p-8 mx-5 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
        <p className="text-base text-white">
          Discuss code with your collaborators using the integrated live chat feature.
        </p>
      </div>

      {/* Feature: Syntax Highlighting */}
      <div className="max-w-md bg-transparent border border-white rounded-lg p-8 mx-5">
        <h3 className="text-xl font-semibold text-white mb-4">Syntax Highlighting</h3>
        <p className="text-base text-white">
          Syntax highlighting for various programming languages to improve code readability.
        </p>
      </div>

      {/* Additional features can be added similarly */}
    </div>
    </div>
  );
};
