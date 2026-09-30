"use client"

import api from "@/utils/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AddStation = () => {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await api.post("/owner/stations/add", { name });
            if (data.success) {
                toast.success(`New toll station ${data.station.name} is created`);
                router.push("/owner/stations");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 401) {
                    toast.error(error.response?.data?.message);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-10 md:mt-20 max-md:mb-20">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl mb-3">
                    Add Station
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white text-gray-500 w-full max-w-85 mx-4 p-6 text-left
                        text-sm rounded-lg border border-gray-300/60"
                >
                    {/* STATION NAME */}
                    <label className="font-medium">
                        Station Name
                    </label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter station name"
                        required
                    />

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className={`my-3 bg-indigo-500 w-full flex items-center justify-center gap-2 py-2 px-5
                            rounded text-white font-medium cursor-pointer text-lg hover:bg-indigo-700
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                            ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={loading}          >
                        {loading ? "Processing..." : "Add"}
                        {!loading && (
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 8H8m0 0H6m2 0V6m0 2v2m3.333 4H4.667A2.667 2.667 0 0 1 2 11.333V4.667A2.667 2.667 0 0 1 4.667 2h6.666A2.667 2.667 0 0 1 14 4.667v6.666A2.667 2.667 0 0 1 11.333 14Z"
                                    stroke="currentColor"
                                    strokeOpacity=".8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div >
    );
};

export default AddStation
