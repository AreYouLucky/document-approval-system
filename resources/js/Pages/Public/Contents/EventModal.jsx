import React, { memo, useEffect, useRef } from "react";
import Modal from "@/Components/Forms/Modal";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const EventModal = ({ show, onClose, data }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onClose]);

    const imageNames = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg', 'g.jpg', 'h.jpg', 'i.jpg', 'j.jpg', 'k.jpg'];

    const images = imageNames.map((img) => ({
        original: `/storage/images/events/${data.title}/${img}`,
        thumbnail: `/storage/images/events/${data.title}/${img}`,
        originalHeight: '400px',
    }));

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div
                ref={modalRef}
                className=" bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl transition-transform p-2 relative"
            >
                <div className="flex flex-col items-center px-10 pb-2 pt-7">
                    <ImageGallery
                        items={images}
                        loading="lazy"
                        showNav={false}
                        thumbnailPosition="left"
                        slideInterval={6000}
                        autoPlay
                    />
                </div>
                <div className="w-full  bg-gray-100 dark:bg-gray-800 rounded-b-lg relative px-10 py-4">
                    <div className="py-5 px-2">
                        <h3 className="text-xl text-gray-700 dark:text-gray-50 text-start nunito-bold mb-2">
                            {data.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-100 text-sm mt-1 text-justify roboto-thin">{data.desc}</p>
                        <p className='text-gray-400 text-start mt-2'>{data.date}</p>
                    </div>
                </div>
                <div className="absolute top-3 right-5 nunito-bold">
                    <button onClick={onClose}>x</button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(EventModal);
