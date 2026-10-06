"use client"

import api from "@/utils/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

type Workers = {
    id: number;
    worker: string;
    station: string;
    owner: string;
    status: boolean;
    collected: number;
};

const Workers = () => {
    const [workers, setWorkers] = useState<Workers[]>([]);

    const fetchWorkers = async () => {
        try {
            const { data } = await api.get("/admin/dashboard/workers");
            if (data.success) {
                setWorkers(data.workers);
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
        fetchWorkers();
    }, []);

    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40">
            <h1 className="text-xl md:text-2xl text-center text-slate-800 md:mt-10">Workers</h1>

            <table className="md:max-w-[80%] mx-auto w-full mt-4 md:mt-8 border-collapse text-center">
                <thead className="max-md:text-xs">
                    <tr className="border-b">
                        <th>Worker</th>
                        <th>Station</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Collected</th>
                    </tr>
                </thead>

                <tbody className="max-md:text-xs">
                    {workers.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="md:p-3">
                                <Link href={`/admin/worker/${item.id}`}>
                                    {item.worker}
                                </Link>
                            </td>

                            <td className="md:p-3">{item.station}</td>

                            <td className="md:p-3">{item.owner}</td>

                            <td className={`md:p-3 ${item.status ? "text-green-600" : "text-slate-300"}`}>
                                {item.status ? "Active" : "Inactive"}
                            </td>

                            <td className="md:p-3">${item.collected}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Workers
