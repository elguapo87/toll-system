"use client"

import api from "@/utils/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AddWorker = () => {
    const [stationId, setStationId] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await api.post("/owner/workers/add", {
                firstName,
                lastName,
                stationId: Number(stationId)
            });

            if (data.success) {
                toast.success(data.message);
                router.push("/protected/workers");
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
    }

    return (
        <div className="flex justify-center items-center mt-10 max-md:pb-30">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl mb-3">
                    Add Worker
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white text-gray-500 w-full max-w-85 mx-4 p-6 text-left
                        text-sm rounded-lg border border-gray-300/60"
                >
                    {/* STATION */}
                    <label className="font-medium">
                        Station ID
                    </label>
                    <input
                        value={stationId}
                        onChange={(e) => setStationId(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="number"
                        placeholder="Enter Worker ID"
                        required
                    />

                    {/* FIRST NAME */}
                    <label className="font-medium">
                        First Name
                    </label>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter Worker ID"
                        required
                    />

                    {/* LAST NAME */}
                    <label className="font-medium">
                        Last Name
                    </label>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter Worker ID"
                        required
                    />

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className={`my-3 bg-indigo-500 w-full flex items-center justify-center gap-2 py-2 px-5
                            rounded text-white font-medium cursor-pointer text-lg hover:bg-indigo-700
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                            ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={loading}
                    >
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
        </div>
    )
}

export default AddWorker
