"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Stations = {
    id: number;
    name: string;
    collections: number;
    revenue: number;
};

type History = {
    id: number;
    amount: number;
    createdAt: string | Date;
    station: {
        id: number,
        name: string;
    };
    worker: {
        id: number;
        firstName: string;
        lastName: string;
    };
};

type VehicleData = {
    vehicle: {
        id: number;
        licensePlate: string;
        brand: string;
        model: string;
        color: string;
        type: string;
        hasTrailer: boolean;
    };
    collections: number;
    revenue: number;
    stations: Stations[];
    history: History[];
};

const Vehicle = () => {
    const { id } = useParams();

    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

    const fetchVehicleData = async () => {
        try {
            const { data } = await api.get(`/admin/dashboard/vehicle/${id}`);
            if (data.success) {
                setVehicleData(data.result);
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

        fetchVehicleData();
    }, [id]);

    if (!vehicleData) return null;

    console.log(vehicleData);


    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40">
            {/* CAR INFO */}
            <div className="border border-slate-500 rounded-lg w-full md:w-1/2 p-1 md:p-3 mx-auto mb-10">
                <h1 className="text-center text-base md:text-2xl mb-1">
                    {vehicleData.vehicle.brand} {vehicleData.vehicle.model}
                </h1>
                <div className="border border-slate-500 rounded-md p-1 w-fit mx-auto mb-10">
                    <h1 className="text-base md:text-lg text-slate-700">{vehicleData.vehicle.licensePlate}</h1>
                </div>

                <div className="flex items-center justify-around flex-wrap mb-5 text-sm md:text-lg">
                    <p className="text-slate-700">Type:</p>
                    <p>{vehicleData.vehicle.type}</p>
                    <p className="text-slate-700">Color:</p>
                    <p>{vehicleData.vehicle.color}</p>
                </div>
                <div className="flex items-center justify-around flex-wrap mb-5 text-sm md:text-lg">
                    <p className="text-slate-700">Brand:</p>
                    <p>{vehicleData.vehicle.brand}</p>
                    <p className="text-slate-700">Model:</p>
                    <p>{vehicleData.vehicle.model}</p>
                </div>
                <div className="flex items-center justify-around flex-wrap text-sm md:text-lg">
                    <p className="text-slate-700">Trailer:</p>
                    <p>{vehicleData.vehicle.hasTrailer ? "Yes" : "no"}</p>
                    <p className="text-slate-700">Vehicle ID:</p>
                    <p>{vehicleData.vehicle.id}</p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="flex items-center justify-center gap-2 md:justify-evenly w-full md:w-1/2 mx-auto mb-10">
                <div className="border border-slate-500 rounded-lg flex items-center justify-center gap-1 p-3">
                    <h2 className="max-md:text-sm">Collections:</h2>
                    <h2 className="max-md:text-sm">{vehicleData.collections}</h2>
                </div>
                <div className="border border-slate-500 rounded-lg flex items-center justify-center gap-1 p-3">
                    <Image
                        src="/total_money.svg"
                        alt="Money"
                        width={26}
                        height={26}
                        className="size-6.5"
                    />
                    <h2 className="max-md:text-sm">Revenue:</h2>
                    <h2 className="max-md:text-sm">{vehicleData.revenue}</h2>
                </div>
            </div>

            {/* STATIONS */}
            <h1 className="text-center mb-1.5 md:mb-3 text-lg md:text-2xl">Vehicle summary</h1>
            <table className="md:max-w-[80%] mx-auto w-full border-collapse text-center mb-10">
                <thead className="max-md:text-sm">
                    <tr className="border-b">
                        <th>Station</th>
                        <th>Collections</th>
                        <th className="flex items-center gap-1 justify-center">
                            <Image
                                src="/total_money.svg"
                                alt="Money"
                                width={24}
                                height={24}
                                className="size-6"
                            />
                            Revenue
                        </th>
                    </tr>
                </thead>

                <tbody className="max-md:text-xs">
                    {vehicleData.stations.map((station, index) => (
                        <tr key={station.id} className="border-b">
                            <td className="md:p-3">{station.name}</td>
                            <td className="md:p-3">{station.collections}</td>
                            <td className="md:p-3">{station.revenue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* HISTORY */}
            <h1 className="text-center mb-1.5 md:mb-3 text-lg md:text-2xl">Collection history</h1>
            <table className="md:max-w-[80%] mx-auto w-full border-collapse text-center">
                <thead className="max-md:text-sm">
                    <tr className="border-b">
                        <th>Date</th>
                        <th>Station</th>
                        <th>Worker</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody className="max-md:text-xs">
                    {vehicleData.history.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="md:p-3">{new Date(item.createdAt).toLocaleString()}</td>
                            <td className="md:p-3">{item.station.name}</td>
                            <td className="md:p-3">{item.worker.firstName} {item.worker.lastName}</td>
                            <td className="md:p-3">{item.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Vehicle
