


"use client";

import React, { useState, useEffect } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChangeProfilePicture: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [oldPhoto, setOldPhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true); // For initial user data loading
    const apiurl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authorization token is missing");
                    router.push("/login");
                    return;
                }

                const response = await axios.get(`${apiurl}/api/users/users/mydetails`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = response.data.data;
                setOldPhoto(
                    userData.profilePicture ||
                    "https://res.cloudinary.com/dmdsoq8cj/image/upload/v1726251247/todo/uploads/profile_picture/jbhzs6zunn0n86xkgjwv.jpg"
                );
                setPreview(
                    userData.profilePicture ||
                    "https://res.cloudinary.com/dmdsoq8cj/image/upload/v1726251247/todo/uploads/profile_picture/jbhzs6zunn0n86xkgjwv.jpg"
                );
            } catch (err) {
                setError("Failed to fetch user data");
            } finally {
                setFetching(false);
            }
        };

        fetchUserData();
    }, [apiurl, router]);

    const handleCapturePhoto = async () => {
        try {
            const photo = await Camera.getPhoto({
                resultType: CameraResultType.DataUrl, // Use Data URL for direct base64 image preview
                source: CameraSource.Camera, // Use the device's camera
                quality: 90,
            });

            if (photo.dataUrl) {
                setPreview(photo.dataUrl);
            }
        } catch (err) {
            setError("Failed to capture photo");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!preview) {
            setError("No photo selected");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authorization token is missing");
                router.push("/login");
                return;
            }

            // Convert preview (dataUrl) to Blob if using Camera, or use File directly if uploading
            const blob = preview.startsWith("data:")
                ? await fetch(preview).then((res) => res.blob())
                : null;
            const file =
                blob && !preview.startsWith("http")
                    ? new File([blob], "profile_picture.jpg", { type: "image/jpeg" })
                    : null;

            const formData = new FormData();
            if (file) {
                formData.append("profile_picture", file);
            }

            const response = await axios.post(
                `${apiurl}/api/users/update-profile-picture`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setSuccess("Profile picture updated successfully!");
                setPreview(response.data.profilePicture); // Update preview with the new photo URL
            }
        } catch (err) {
            setError("Failed to update profile picture");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Loading user data...</div>;

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
            <div className="max-w-xl w-full p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">Change Profile Picture</h1>
    
            {success && <div className="text-green-600 text-center mb-4">{success}</div>}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
    
            <form onSubmit={handleSubmit} className="text-center">
                    <div className="mb-6">
                        <div className="mb-4">
                            <img
                                src={preview || oldPhoto || undefined}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-gray-300"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300 mb-4"
                        >
                            Use Camera
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block mx-auto mb-4"
                        />
                    </div>
    
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:from-green-500 hover:to-blue-600 transition duration-300"
                    >
                        Update Profile Picture
                    </button>
                </form>
        </div>
        </div>
    );
};

export default ChangeProfilePicture;

