"use client"

import api from "@/utils/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

const CollectToll = () => {
    const [workerId, setWorkerId] = useState("");
    const [type, setType] = useState("CAR");
    const [hasTrailer, setHasTrailer] = useState(false);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [licensePlate, setLicensePlate] = useState("");

    const [stationsCount, setStationsCount] = useState(0);
    const [workersCount, setWorkersCount] = useState(0);
    const [loadingData, setLoadingData] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get("/owner/stations/count");
                if (data.success) {
                    setStationsCount(data.stationsCount);
                    setWorkersCount(data.workersCount);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status !== 401) {
                        toast.error(error.response?.data?.message);
                    }
                }
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

    if (loadingData) {
        return <p className="text-center mt-10">Loading data...</p>;
    }

    if (stationsCount === 0) {
        return (
            <div className="flex flex-col items-center mt-10 gap-4">
                <h1 className="text-2xl">No Stations Available</h1>
                <p>You need to create a station then you need add a worker.</p>

                <Link
                    href="/owner/addStation"
                    className="bg-indigo-500 text-white px-5 py-2 rounded hover:bg-indigo-700"
                >
                    Add Station
                </Link>
            </div>
        );
    }

    if (workersCount === 0) {
        return (
            <div className="flex flex-col items-center mt-10 gap-4">
                <h1 className="text-2xl">No Worker Available</h1>
                <p>You need to add a worker.</p>

                <Link
                    href="/owner/addWorker"
                    className="bg-indigo-500 text-white px-5 py-2 rounded hover:bg-indigo-700"
                >
                    Add Worker
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await api.post("/owner/collections/collectToll", {
                workerId: Number(workerId),
                vehicle: {
                    brand: brand,
                    model: model,
                    licensePlate,
                    color: color,
                    type: type,
                    ...(type === "TRUCK" && {
                        hasTrailer
                    })
                }
            });

            if (data.success) {
                toast.success(data.message + ` Amount $${data.amount}`);
                setBrand("");
                setLicensePlate("");
                setModel("");
                setColor("");
                setHasTrailer(false);
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
        <div className="flex justify-center items-center mt-8 md:mt-10 pb-30 md:pb-35">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl mb-3">
                    Collect Toll
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white text-gray-500 w-full max-w-85 mx-4 p-6 text-left
                        text-sm rounded-lg border border-gray-300/60"
                >
                    {/* WORKER */}
                    <label className="font-medium">
                        Worker ID
                    </label>
                    <input
                        value={workerId}
                        onChange={(e) => setWorkerId(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="number"
                        placeholder="Enter Worker ID"
                        required
                    />

                    {/* LICENSE PLATE */}
                    <label className="font-medium">
                        License Plate
                    </label>
                    <input
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter License Plate"
                        required
                    />

                    {/* VEHICLE TYPE */}
                    <label className="font-medium">
                        Vehicle Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => { setType(e.target.value); setHasTrailer(false); }}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                    >
                        <option value="CAR">Car</option>
                        <option value="BUS">Bus</option>
                        <option value="TRUCK">Truck</option>
                        <option value="BIKE">Bike</option>
                    </select>

                    {/* TRAILER */}
                    {type === "TRUCK" && (
                        <div className="flex items-center justify-between mb-4">
                            <label className="font-medium">
                                Trailer?
                            </label>

                            <input
                                onChange={(e) => setHasTrailer(e.target.checked)}
                                type="checkbox"
                                checked={hasTrailer}
                                className="size-4"
                            />
                        </div>
                    )}

                    {/* BRAND */}
                    <label className="font-medium">
                        Brand
                    </label>
                    <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter Brand"
                        required
                    />

                    {/* MODEL */}
                    <label className="font-medium">
                        Model
                    </label>
                    <input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter Model"
                        required
                    />

                    {/* COLOR */}
                    <label className="font-medium">
                        Color
                    </label>
                    <input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full border mt-1.5 mb-4 border-gray-500/30 outline-none rounded py-2.5 px-3"
                        type="text"
                        placeholder="Enter Color"
                        required
                    />
                    {/* SUBMIT */}
                    <button
                        className={`my-3 bg-indigo-500 w-full flex items-center justify-center gap-2 py-2 px-5
                            rounded text-white font-medium cursor-pointer text-lg hover:bg-indigo-700
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                            ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Collecting..." : "Collect Toll"}
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

export default CollectToll
