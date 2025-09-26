import React, { useState, useEffect, useRef } from 'react';

interface ImageProps {
    src: string;
    width: number;
    height: number;
    alt: string;
    className?: string;
}

const Image: React.FC<ImageProps> = ({ src, width, height, alt, className }) => {
    const [resizedSrc, setResizedSrc] = useState<string>('');
    const imgRef = useRef<HTMLImageElement | null>(null); // ref to the image element

    // Resize the image and return it as a data URL
    const resizeImage = (image: HTMLImageElement, width: number, height: number): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return '';
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the image to the canvas with the new size
        ctx.drawImage(image, 0, 0, width, height);

        // Return the resized image as base64 data URL
        return canvas.toDataURL();
    };

    useEffect(() => {
        const imageElement = imgRef.current;
        if (imageElement) {
            imageElement.onload = () => {
                const resizedImage = resizeImage(imageElement, width, height);
                setResizedSrc(resizedImage);
            };

            // Set the image src (this triggers the load event)
            imageElement.src = src;
        }
    }, [src, width, height]);

    return (
        <img
            ref={imgRef} // Using ref to access the image element
            src={resizedSrc || src} // Use resized image if available
            alt={alt}
            width={width}
            height={height}
            className={className}
        />
    );
};

export default Image;
