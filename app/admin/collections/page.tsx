"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Station = {
    id: number;
    name: string;
};

type Worker = {
    id: number;
    firstName: string;
    lastName: string;
};

type Vehicle = {
    id: number;
    licensePlate: string;
    type: string;
};

type Collections = {
    id: number;
    amount: number;
    createdAt: string | Date;
    worker: {
        id: number;
        firstName: string;
        lastName: string;
    };
    station: {
        id: number;
        name: string;
    };
    vehicle: {
        id: number;
        licensePlate: string;
        type: string;
    };
};

const Collections = () => {
    const [collections, setCollections] = useState<Collections[]>([]);

    const [stations, setStations] = useState<Station[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [selectedStation, setSelectedStation] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [filteredCollections, setFilteredCollections] = useState<Collections[]>([]);

    const [showFilter, setShowFilter] = useState(false);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get("/admin/dashboard/allCollections");
            if (data.success) {
                setCollections(data.collections);


                const uniqueStations = data.collections.reduce(
                    (stations: Station[], collection: Collections) => {
                        const exists = stations.some((station) => station.id === collection.station.id);
                        if (!exists) {
                            stations.push(collection.station)
                        }

                        return stations;
                    },
                    []
                );

                const uniqueWorkers = data.collections.reduce(
                    (workers: Worker[], collection: Collections) => {
                        const exists = workers.some((worker) => worker.id === collection.worker.id);
                        if (!exists) {
                            workers.push(collection.worker);
                        }

                        return workers;
                    },
                    []
                );

                const uniqueVehicles = data.collections.reduce(
                    (vehicles: Vehicle[], collection: Collections) => {
                        const exists = vehicles.some((vehicle) => vehicle.id === collection.vehicle.id);
                        if (!exists) {
                            vehicles.push(collection.vehicle);
                        }

                        return vehicles;
                    },
                    []
                );

                setStations(uniqueStations);
                setWorkers(uniqueWorkers);
                setVehicles(uniqueVehicles);
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
        fetchCollections();
    }, []);

    useEffect(() => {
        const matchesStation = (station: Station) => selectedStation === "" || station.id === Number(selectedStation);
        const matchesWorker = (worker: Worker) => selectedWorker === "" || worker.id === Number(selectedWorker);
        const matchesVehicle = (vehicle: Vehicle) => selectedVehicle === "" || vehicle.id === Number(selectedVehicle);

        const matchesDate = (createdAt: string | Date) => {
            const date = new Date(createdAt);

            const afterFromDate = fromDate === "" || date >= new Date(`${fromDate}T00:00:00`);
            const beforeToDate = toDate === "" || date <= new Date(`${toDate}T23:59:59.999`);

            return afterFromDate && beforeToDate;
         };

        const newFilteredCollections = collections.filter(
            (collection) => matchesStation(collection.station)
                && matchesWorker(collection.worker)
                && matchesVehicle(collection.vehicle)
                && matchesDate(collection.createdAt)
            );

        setFilteredCollections(newFilteredCollections);
    }, [collections, selectedStation, selectedWorker, selectedVehicle, fromDate, toDate]);

    const filteredCollectionsCount = filteredCollections.length;

    const filteredTotalCollected = filteredCollections.reduce((total, collection) => total + collection.amount, 0);

    return (
        <div className="mt-10 md:mt-20 mb-30 md:mb-40">
            <button
                onClick={() => setShowFilter(prev => !prev)}
                className="md:hidden p-0.75 md:p-1 rounded border border-gray-400 text-xs
                     md:text-sm ml-5 max-md:mb-2"
            >
                {showFilter ? "Close" : "Filters"}
            </button>

            <div className={`${showFilter ? "" : "max-md:hidden"} md:mb-8 ml-5`}>
                <div className="max-md:mb-3 flex max-md:flex-col items-start md:items-center gap-2 md:gap-5">
                    <div className="flex flex-col items-center">
                        <label className="max-md:hidden text-sm">Search by station</label>
                        <select
                            onChange={(e) => setSelectedStation(e.target.value)}
                            className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                        >
                            <option value="">All Stations</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>{station.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-center">
                        <label className="max-md:hidden text-sm">Search by worker</label>
                        <select
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                        >
                            <option value="">All Workers</option>
                            {workers.map((worker) => (
                                <option key={worker.id} value={worker.id}>{worker.firstName} {worker.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-center">
                        <label className="max-md:hidden text-sm">Search by vehicle</label>
                        <select
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                        >
                            <option value="">All Vehicles</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>{vehicle.type}</option>
                            ))}
                        </select>

                    </div>

                    <div className="flex flex-col items-center max-md:hidden">
                        <label className="text-sm">Search from date</label>
                        <input
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            type="date"
                            className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                        />
                    </div>

                    <div className="flex flex-col items-center max-md:hidden">
                        <label className="text-sm">Search to date</label>
                        <input
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            type="date"
                            className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                        />
                    </div>
                </div>
            </div>

            <h1 className="text-center text-2xl mb-3">All collections</h1>
            <table className="md:max-w-[80%] mx-auto w-full border-collapse text-center mb-10">
                <thead className="max-md:text-sm">
                    <tr className="border-b">
                        <th className="max-md:hidden">Date</th>
                        <th>Station</th>
                        <th>Worker</th>
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody className="max-md:text-xs">
                    {filteredCollections.map((collection) => (
                        <tr key={collection.id} className="border-b">
                            <td className="md:p-3 max-md:hidden">{new Date(collection.createdAt).toLocaleString()}</td>
                            <td className="md:p-3">{collection.station.name}</td>
                            <td className="md:p-3">{collection.worker.firstName} {collection.worker.lastName}</td>
                            <td className="md:p-3">
                                <Link href={`/admin/vehicle/${collection.vehicle.id}`}>
                                    {collection.vehicle.licensePlate}
                                </Link>
                            </td>
                            <td className="md:p-3">{collection.vehicle.type}</td>
                            <td className="md:p-3">{collection.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-center gap-3 md:gap-10">
                <div
                    className="border border-slate-500 flex items-center justify-center gap-1 p-1.5
                        md:p-3 rounded-lg"
                >
                    <h2 className="text-base md:text-xl text-slate-700">Collections:</h2>
                    <span className="text-base md:text-xl">{filteredCollectionsCount}</span>
                </div>

                <div
                    className="border border-slate-500 flex items-center justify-center gap-1 p-1.5
                        md:p-3 rounded-lg"
                >
                    <Image
                        src="/total_money.svg"
                        alt="Money"
                        width={26}
                        height={26}
                        className="size-6.5"
                    />
                    <h2 className="text-base md:text-xl text-slate-700">Revenue:</h2>
                    <span className="text-base md:text-xl">{filteredTotalCollected}</span>
                </div>
            </div>
        </div>
    )
}

export default Collections