import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen w-screen">
      <Image 
        src="https://i.imgur.com/nqgZREZ.jpeg" 
        alt="Background Image" 
        layout="fill" 
        objectFit="cover" 
        quality={100}
        className="z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl text-white font-bold mb-4">Welcome to CCNY PhD Hub</h1>
        <p className="text-xl text-white text-center max-w-2xl">
          A community platform for PhD students at CCNY to connect, collaborate, and share resources.
        </p>
      </div>
    </div>
  );
}
