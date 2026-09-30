"use client"

import api from "@/utils/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

type Worker = {
    id: number;
    firstName: string;
    lastName: string;
    collectedAmount: number;
    station: {
        id: number;
        name: string;
    }
}

const Workers = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);

    const fetchWorkers = async () => {
        try {
            const { data } = await api.get("/owner/workers/workersByStation");
            if (data.success) {
                setWorkers(data.workers);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const workersByStation = workers.reduce(
        (groups, worker) => {
            const stationId = worker.station.id;

            if (!groups[stationId]) {
                groups[stationId] = {
                    id: worker.station.id,
                    name: worker.station.name,
                    workers: []
                };
            }

            groups[stationId].workers.push(worker);

            return groups;
        },
        {} as Record<
            number,
            {
                id: number;
                name: string;
                workers: Worker[];
            }
        >
    );

    return (
        <div className="px-0 md:px-5 lg:px-10 mx-auto mt-10 md:mt-20 pb-30 md:pb-40">
            {Object.values(workersByStation).map((station) => (
                <div key={station.id} className="mb-20">
                    <h2 className="text-xl font-semibold mb-5 text-center">{station.name}</h2>

                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="border-b">
                                <th>ID</th>
                                <th>Worker</th>
                                <th>Collected</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {station.workers.map((worker) => (
                                <tr key={worker.id} className="border-b">
                                    <td className="py-3">{worker.id}</td>
                                    <td className="py-3">{worker.firstName} {worker.lastName}</td>
                                    <td className="py-3">{worker.collectedAmount}</td>
                                    <td className="py-3">
                                        <Link
                                            href={`/protected/worker/${worker.id}`} 
                                            className="px-2 py-0.5 border border-slate-600 bg-transparent text-sm
                                                cursor-pointer rounded"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}

export default Workers
