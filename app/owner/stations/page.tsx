"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

type Stations = {
    id: number;
    name: string;
    workers: [];
    workersNumber: number;
    collections: number;
    totalCollected: number;
};

const Stations = () => {
    const [stations, setStations] = useState<Stations[]>([]);

    const fetchStations = async () => {
        try {
            const { data } = await api.get("/owner/stations/allStations");
            if (data.success) {
                setStations(data.formattedStations);
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
        fetchStations();
    }, []);

    return stations.length > 0 ? (
        <div className="mt-10 md:mt-15 pb-30 md:pb-40">
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-10">
                {stations.map((station) => (
                    <div
                        className="flex flex-col items-center justify-center gap-5 md:gap-5
                            border border-slate-600 mb-10 py-8 px-10 w-fit rounded-lg"
                        key={station.id}
                    >

                        <div className="flex items-center gap-1">
                            <h1 className="text-2xl md:text-3xl text-slate-600">Station ID:</h1>
                            <h1 className="text-2xl md:text-3xl text-slate-800">{station.id}</h1>
                        </div>

                        <div className="flex items-end gap-5">
                            <Image
                                src="/house.svg"
                                alt="Station"
                                width={40}
                                height={40}
                                className="size-10"
                            />
                            <h1 className="text-2xl md:text-3xl text-slate-800">{station.name}</h1>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2">
                            {station.workersNumber > 0 ? (
                                <div className="flex items-end gap-2 text-xl md:text-2xl pb-1 border-b border-slate-500">
                                    <Image
                                        src="/worker.svg"
                                        alt="Worker"
                                        width={40}
                                        height={40}
                                        className="size-10 -translate-y-1.25"
                                    />
                                    {station.workersNumber > 1 && (
                                        <span>
                                            {station.workersNumber}
                                        </span>
                                    )}
                                    <h2 className="text-slate-800">
                                        {station.workersNumber === 1 ? "Worker" : "Workers"}
                                    </h2>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h1 className="text-lg text-slate-700">This station has no workers.</h1>
                                    <Link
                                        className="italic text-sm text-slate-700"
                                        href="/owner/addWorker"
                                    >
                                        Click here to add workers
                                    </Link>
                                </div>
                            )}
                            <ul className=" text-slate-800">
                                {station.workers.map((item, index) => (
                                    <li
                                        key={index}
                                        className="text-slate-900"
                                    >
                                        {station.workersNumber > 1 && index + 1 + "."} {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-2 text-xl border border-slate-800 p-2 rounded-lg">
                            <span>{station.collections}</span>
                            <span>Collections</span>
                        </div>

                        <div className="flex flex-col text-center items-center justify-center rounded-xl gap-4 w-full">
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
                                <h3 className="text-xl font-semibold text-slate-700">Total Revenue</h3>
                                <h2 className="text-xl text-slate-600">${station.totalCollected}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="text-center mt-10 md:mt-20">
            <h1 className="text-xl md:text-3xl text-slate-700 mb-2">
                No stations added yet
            </h1>

            <Link href="/owner/addStation" className="italic text-sm text-slate-700">
                Click here to add station
            </Link>
        </div>
    )
}

export default Stations
