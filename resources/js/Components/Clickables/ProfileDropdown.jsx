import { Dropdown, Avatar } from "flowbite-react";
import { useState } from "react";
import { usePage , router} from "@inertiajs/react";

export default function ProfileDropdown({ className = "", img }) {
    // const user = usePage().props.auth.user;

    const [user, setUser] = useState({
        full_name: "John Doe",
        qms_role: "Admin",
        image_path: null,
    });

    const { url } = usePage();

    const avatarSrc = user.image_path
        ? `http://hris.stii.local/frontend/hris/images/user_image/${user.image_path}`
        : "/storage/images/user.png";

    return (
        <Dropdown
            label={
                <Avatar img={avatarSrc} rounded bordered  className="w-10 " size="sm"/>
            }
            inline className={` p-2` + className}
        >
            <Dropdown.Header className="px-10 ">
                <span className="block text-sm font-medium">{user.full_name}</span>
                <span className="block text-sm text-gray-500">{user.qms_role}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => { router.visit('/profile') }} className={` ${(url === '/profile'
                            ? "bg-blue-500 text-white"
                            : "text-black bg-transparent")} `}>View Profile</Dropdown.Item>
            <Dropdown.Divider  className="text-black"/>
            <Dropdown.Item onClick={() => { router.visit('/logout') }}>Logout</Dropdown.Item>
        </Dropdown>
    );
}
