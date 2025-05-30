import { useState } from "react";

export default function ApplicationLogo(props) {
    const [src, setSrc] = useState("/storage/images/1.png");

    return (
        <img
            src={src}
            alt="Application Logo"
            onError={() => setSrc("/storage/images/stii.png")} // fallback image
            {...props}
        />
    );
}
