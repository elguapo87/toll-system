"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Worker = {
    firstName: string;
    lastName: string;
    active: boolean;
    collectedAmount: number;
    createdAt: string | Date;
    station: {
        name: string;
    };
    _count: {
        collections: number;
    };
};

const Worker = () => {
    const { id } = useParams();

    const [worker, setWorker] = useState<Worker | null>(null);

    const fetchWorker = async () => {
        try {
            const { data } = await api.get(`/admin/dashboard/worker/${id}`);
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
        if (!id) return;

        fetchWorker();
    }, [id]);

    if (!worker) return null;

    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40 flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl font-semibold text-center mx-auto">{worker.firstName} {worker.lastName}</h1>

            <div className="flex items-center gap-1">
                <span className="text-slate-800 text-lg">Status:</span>
                <h2
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
                Working since - {new Date(worker.createdAt).toLocaleDateString()}
            </h2>

            <h2 className="text-xl text-slate-500 text-center mt-2 max-w-md mx-auto">
                Collections: <span>{worker._count.collections}</span>
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
        </div>
    )
}

export default Worker
