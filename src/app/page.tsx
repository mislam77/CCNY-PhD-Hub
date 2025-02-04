import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <Image 
          src="https://i.imgur.com/nqgZREZ.jpeg" 
          alt="Background Image" 
          layout="fill" 
          objectFit="cover" 
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Welcome to CCNY PhD Hub</h1>
          <p className="text-md md:text-xl text-white text-center max-w-2xl">
          A community platform for PhD students at CCNY to connect, collaborate, and share resources.
          </p>
        </div>
      </div>

      {/* Resource Section */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/fellowships" className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <Image
                src="/placeholder.png"
                alt="Fellowships"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Fellowship Opportunities</h3>
                <p className="text-gray-600">Learn how fellowships can help support your Ph.D. journey.</p>
              </div>
            </Link>
            <Link href="/events" className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <Image
                src="/placeholder.png"
                alt="Events"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Events</h3>
                <p className="text-gray-600">Explore events tailored for Ph.D. students.</p>
              </div>
            </Link>
            <Link href="/faq" className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <Image
                src="/placeholder.png"
                alt="FAQ"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
                <p className="text-gray-600">Answers to common questions for Ph.D. students.</p>
              </div>
            </Link>
            <Link href="/contact" className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
              <Image
                src="/placeholder.png"
                alt="Contact"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Contact Ph.D. Hub</h3>
                <p className="text-gray-600">Reach out for additional support and resources.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Stories & Events Section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Latest Stories & Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Cards */}
            {['/placeholder.png', '/placeholder.png', '/placeholder.png'].map((image, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Event ${idx + 1}`}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">Event Title {idx + 1}</h3>
                  <p className="text-gray-600">Description for event {idx + 1}.</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Load More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}