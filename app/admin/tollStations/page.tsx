"use client"

import api from "@/utils/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TollStation = {
    id: number;
    name: string;
    owner: string;
    workers: number;
    collections: number;
    revenue: number;
};

const TollStations = () => {
    const [tollStations, setTollStations] = useState<TollStation[]>([]);

    const fetchStations = async () => {
        try {
            const { data } = await api.get("/admin/dashboard/tollStations");
            if (data.success) {
                setTollStations(data.formattedStations);
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

    console.log(tollStations);


    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40">
            <h1 className="text-xl md:text-2xl text-center text-slate-800">Toll Station List</h1>

            <table className="w-full md:max-w-[80%] mx-auto mt-4 md:mt-8 border-collapse text-center">
                <thead className="max-md:text-xs">
                    <tr className="border-b">
                        <th className="max-md:hidden">ID</th>
                        <th>Station</th>
                        <th>Owner</th>
                        <th>Workers</th>
                        <th>Collections</th>
                        <th>Revenue</th>
                    </tr>
                </thead>

                <tbody className="max-md:text-xs">
                    {tollStations.map((station) => (
                        <tr key={station.id} className="border-b">
                            <td className="md:p-3 max-md:hidden">
                                <Link href={`/admin/station/${station.id}`}>
                                    {station.id}
                                </Link>
                            </td>

                            <td className="md:p-3">
                                <Link href={`/admin/station/${station.id}`}>
                                    {station.name}
                                </Link>
                            </td>

                            <td className="md:p-3">
                                {station.owner}
                            </td>

                            <td className="md:p-3">
                                {station.workers}
                            </td>

                            <td className="md:p-3">
                                {station.collections}
                            </td>

                            <td className="md:p-3">
                                {station.revenue}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TollStations
