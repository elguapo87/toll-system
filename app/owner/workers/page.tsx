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
    active: boolean;
    station: {
        id: number;
        name: string;
    }
}

const Workers = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const fetchWorkers = async () => {
        try {
            const { data } = await api.get("/owner/workers/workersByStation");
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

    const workersByStation = workers.reduce(
        (groups, worker) => {
            if (!groups[worker.station.id]) {
                groups[worker.station.id] = {
                    id: worker.station.id,
                    name: worker.station.name,
                    workers: []
                }
            }
            groups[worker.station.id].workers.push(worker)

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

    const changeStatus = async (e: React.SyntheticEvent, workerId: number) => {
        e.preventDefault();

        try {
            const { data } = await api.post("/owner/workers/changeStatus", {
                workerId,
                email,
                password
            });

            if (data.success) {
                setWorkers((prevWorkers) =>
                    prevWorkers.map((worker) => (
                        worker.id === worker.id
                            ? { ...worker, active: data.active }
                            : worker
                    ))
                );

                toast.success(data.message);
                setSelectedWorkerId(null);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status !== 401) {
                    toast.error(error.response?.data?.message);
                }
            }
        }
    };

    return workers.length > 0 ? (
        <div className="relative px-0 md:px-5 lg:px-10 mx-auto mt-10 md:mt-20 pb-30 md:pb-40">
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
                                        <div className="flex items-center gap-1 justify-center">
                                            <Link
                                                href={`/owner/worker/${worker.id}`}
                                                className="px-2 py-0.5 border border-slate-600 bg-transparent text-sm
                                                cursor-pointer rounded"
                                            >
                                                View
                                            </Link>

                                            <button
                                                onClick={() => setSelectedWorkerId(worker.id)}
                                                className={`px-2 py-0.5 text-sm cursor-pointer
                                                    max-md:text-xs rounded ${worker.active
                                                        ? "bg-green-500 text-white border border-green-500"
                                                        : "bg-gray-200 text-slate-400 border border-gray-200"}`}
                                            >
                                                {worker.active ? "Active" : "Inactive"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            {selectedWorkerId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <form
                        onSubmit={(e) => changeStatus(e, selectedWorkerId)}
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
                                className={`w-full bg-blue-500 hover:bg-blue-600 transition-all
                                    active:scale-95 py-2 rounded text-white font-medium cursor-pointer`}
                            >
                                Confirm
                            </button>

                            <button
                                onClick={() => setSelectedWorkerId(null)}
                                className={`w-full bg-red-500 hover:bg-red-600 transition-all
                                    active:scale-95 py-2 rounded text-white font-medium cursor-pointer`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            )}
        </div>
    ) : (
        <div className="text-center mt-10 md:mt-20">
            <h1 className="text-xl md:text-3xl text-slate-700 mb-2">
                No added workers yet
            </h1>

            <Link href="/owner/addWorker" className="italic text-sm text-slate-700">
                Click here to add workers
            </Link>
        </div>
    )
}

export default Workers
