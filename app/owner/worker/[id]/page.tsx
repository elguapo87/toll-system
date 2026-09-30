"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Worker = {
    id: number;
    firstName: string;
    lastName: string;
    createdAt: string | Date;
    collectedAmount: number;
    active: boolean;
    stationId: number;
    station: {
        name: string;
    };
};

const Worker = () => {
    const { id } = useParams();

    const [worker, setWorker] = useState<Worker | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const fetchWorker = async () => {
        try {
            const { data } = await api.get(`/owner/workers/${id}`);
            if (data.success) {
                setWorker(data.worker);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 401) {
                    toast.error(error.response?.data?.message);
                }
            }
        }
    };

    useEffect(() => {
        fetchWorker();
    }, [id])

    const changeStatus = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const workerId = worker?.id;
        if (!workerId) return;

        try {
            const { data } = await api.post("/owner/workers/changeStatus", {
                workerId,
                email,
                password
            });
            if (data.success) {
                setWorker({ ...worker, active: data.active });
                setIsOpen(false);
                toast.success(data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 401) {
                    toast.error(error.response?.data?.message);
                }
            }
        }
    };

    if (!worker) return null;

    return (
        <div className="relative flex flex-col items-center justify-center h-screen 
                -translate-y-1/12 md:-translate-y-1/6 gap-5"
        >
            <Image
                onClick={() => router.back()}
                src="/back_icon.svg"
                alt="Back"
                width={40}
                height={40}
                className="size-10 cursor-pointer"
            />
            <h1 className="text-3xl font-semibold text-center mx-auto">{worker.firstName} {worker.lastName}</h1>

            <div className="flex items-center gap-1">
                <span className="text-slate-800 text-lg">Status:</span>
                <h2
                    onClick={() => setIsOpen(true)}
                    className={`rounded-lg p-1.5 cursor-pointer ${worker.active
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-slate-400"}`}
                >
                    {worker.active ? "Active" : "Inactive"}
                </h2>
            </div>

            <h2 className="text-xl text-slate-500 text-center mt-2 max-w-md mx-auto">
                Station - {worker.station.name}
            </h2>
            <h2 className="text-xl text-slate-500 text-center mt-2 max-w-md mx-auto">
                Started working - {new Date(worker.createdAt).toLocaleDateString()}
            </h2>

            <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 gap-4 w-full">
                <div className="p-6 aspect-square bg-violet-100 rounded-full">
                    <Image
                        src="/money.svg"
                        alt="Money"
                        width={40}
                        height={40}
                        className="size-10"
                    />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-700">Total Collected</h3>
                    <h2 className="text-xl text-slate-600">${worker.collectedAmount}</h2>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <form
                        onSubmit={changeStatus}
                        className="flex flex-col  gap-3 bg-stone-100 text-gray-500 
                            p-5 rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
                    >
                        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
                            Owner Confirmation
                        </h2>

                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full outline-none bg-stone-200 py-2.5 rounded pl-3"
                            type="email"
                            placeholder="Email"
                            required
                        />

                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full outline-none bg-stone-200 py-2.5 rounded pl-3"
                            type="password"
                            placeholder="Password"
                            required
                        />

                        <div className="flex items-center justify-between gap-5 mt-3">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 transition-all
                                    active:scale-95 py-2 rounded text-white font-medium cursor-pointer"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-red-500 hover:bg-red-600 transition-all
                                    active:scale-95 py-2 rounded text-white font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Worker
