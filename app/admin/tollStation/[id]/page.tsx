"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Station = {
    name: string;
    owner: string;
    workers: [],
    totalCollected: number;
    workersCount: number;
    collectionsCount: number;
};

const TollStation = () => {
    const { id } = useParams();

    const [station, setStation] = useState<Station | null>(null);

    const fetchStation = async () => {
        try {
            const { data } = await api.get(`/admin/dashboard/tollStation/${id}`);
            if (data.success) {
                setStation(data.station)
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

        fetchStation();
    }, [id]);

    if (!station) return null;

    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40 flex flex-col items-center justify-center gap-5 md:gap-5">
            <h1 className="text-2xl md:text-3xl text-slate-800">{station.name}</h1>

            <h2 className="text-xl md:text-2xl text-slate-800">
                Owner - <span className="text-slate-900">{station.owner}</span>
            </h2>

            <div className="flex flex-col items-center justify-center gap-2">
                <div 
                    className={`flex items-center gap-2 text-xl md:text-2xl
                        ${station.workersCount > 0 ? "border-b border-slate-500" : ""}`}>
                    {station.workersCount > 1 && (
                        <span className="">
                            {station.workersCount}
                        </span>
                    )}
                    {station.workersCount > 0 ? (
                        <h2 className="text-slate-800">{station.workersCount === 1 ? "Worker" : "Workers"}</h2>

                    ) : (
                        <h2>This station has no workers</h2>
                    )}
                </div>
                <ul className=" text-slate-800">
                    {station.workers.map((item, index) => (
                        <li
                            key={index}
                            className="text-slate-900"
                        >
                            {index + 1}. {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex items-center gap-2 text-xl border border-slate-800 p-2 rounded-lg">
                <span>{station.collectionsCount}</span>
                <span>{station.collectionsCount > 1 ? "Collections" : "Collection"}</span>
            </div>

            <div className="flex items-center gap-2 text-xl border border-slate-800 p-2 rounded-lg">
                <Image
                    src="/total_money.svg"
                    alt="Money"
                    width={30}
                    height={30}
                    className="size-7.5"
                />
                <h2>Total collected:</h2>
                <span>${station.totalCollected}</span>
            </div>
        </div>
    )
}

export default TollStation
