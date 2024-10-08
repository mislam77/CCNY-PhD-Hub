import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-[#7D5CC6] p-4 flex justify-between items-center h-24 sticky top-0 z-50 shadow-md">
            <div className="text-white text-xl font-bold">
                <a href="/">CCNY PHD HUB</a>
            </div>
            <div className="flex space-x-4">
                <a href="/about" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">ABOUT</a>
                <a href="/academics" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">ACADEMICS</a>
                <a href="/research" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">RESEARCH</a>
                <a href="/engage" className="text-white px-4 py-2 rounded hover:bg-[#6042a1]">ENGAGE</a>
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
                    <UserButton
                        showName
                        appearance={{
                            elements: {
                                userButtonAvatarBox: 'bg-white w-12 h-12',
                                userButtonBox: 'bg-white rounded-lg p-2',
                                userButtonPopoverCard: 'bg-white shadow-lg rounded-lg p-4',
                                userButtonPopoverActionButton: 'text-[#6c47ff] hover:bg-gray-100',
                                userButtonPopoverActionButtonText: 'text-[#6c47ff]',
                            },
                        }}
                    />
                </SignedIn>
            </div>
        </nav>
    );
};

export default Navbar;