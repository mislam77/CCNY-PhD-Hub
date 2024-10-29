import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
} from '@clerk/nextjs';
import UserButton from './userbutton';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#7D5CC6] p-4 flex justify-between items-center h-24 sticky top-0 z-50 shadow-md">
            <div className="text-white text-xl font-bold">
                <a href="/">CCNY PHD HUB</a>
            </div>
            <div className="flex space-x-4">
                <a href="/about" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">ABOUT</a>
                <a href="/forum" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">FORUM</a>
                <a href="/research" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">RESEARCH</a>
                <a href="/events" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">EVENTS</a>
                <a href="/resources" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">RESOURCES</a>
            </div>
            <div className="w-48 flex justify-end">
                <SignedOut>
                    <SignUpButton>
                        <button className="text-white px-4 py-2 rounded mr-2">
                            Sign Up
                        </button>
                    </SignUpButton>
                    <SignInButton>
                        <button className="bg-white text-[#7D5CC6] px-4 py-2 rounded">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
};

export default Navbar;