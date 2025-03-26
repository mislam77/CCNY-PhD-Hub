'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';
import { FaUserCircle } from "react-icons/fa";

const UserButton: React.FC = () => {
  return (
    <ClerkUserButton
      showName
      appearance={{
        elements: {
          userButtonAvatarBox: 'bg-white w-12 h-12',
          userButtonBox: 'bg-white rounded-lg p-2',
          userButtonPopoverCard: 'bg-white shadow-lg rounded-lg',
          userButtonPopoverActionButton: 'text-[#6c47ff] hover:bg-gray-100',
          userButtonPopoverCustomItemButton: 'text-[#6c47ff]',
        },
      }}
      userProfileProps={{}}
    >
      <ClerkUserButton.MenuItems>
        <ClerkUserButton.Link
          label="Profile"
          labelIcon={<FaUserCircle />}
          href="/profile"
        />
        <ClerkUserButton.Action label="manageAccount" />
        <ClerkUserButton.Action label="signOut" />
      </ClerkUserButton.MenuItems>
    </ClerkUserButton>
  );
};

export default UserButton;