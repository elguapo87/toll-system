"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Station = {
    id: number;
    name: string;
};

type Worker = {
    id: number;
    firstName: string;
    lastName: string
};

type Vehicle = {
    id: number;
    type: string;
    brand: string;
    model: string;
    color: string;
    hasTrailer: boolean
};

type Collection = {
    id: number;
    amount: number;
    createdAt: string | Date;
    station: {
        id: number;
        name: string;
    };
    worker: {
        id: number;
        firstName: string;
        lastName: string
    };
    vehicle: {
        id: number;
        type: string;
        brand: string;
        model: string;
        color: string;
        hasTrailer: boolean
    };
};

const page = () => {
    const [collections, setCollections] = useState<Collection[]>([]);

    const [stations, setStations] = useState<Station[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [filteredCollection, setFilteredCollection] = useState<Collection[]>([]);

    const [selectedStation, setSelectedStation] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");

    const [showFilter, setShowFilter] = useState(false);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get("/owner/collections/collectionsByOwner");
            if (data.success) {
                setCollections(data.collections);

                const uniqueStations = data.collections.reduce(
                    (stations: Station[], collection: Collection) => {
                        const exists = stations.some((station) => station.id === collection.station.id);
                        if (!exists) {
                            stations.push(collection.station)
                        }

                        return stations;
                    },
                    []
                );

                const uniqueWorkers = data.collections.reduce(
                    (workers: Worker[], collection: Collection) => {
                        const exists = workers.some((worker) => worker.id === collection.worker.id);
                        if (!exists) {
                            workers.push(collection.worker);
                        }

                        return workers;
                    },
                    []
                );

                const uniqueVehicles = data.collections.reduce(
                    (vehicles: Vehicle[], collection: Collection) => {
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

        const newFilteredCollection = collections.filter((collection) => 
            matchesStation(collection.station) && 
            matchesWorker(collection.worker) &&
            matchesVehicle(collection.vehicle)
        )

        setFilteredCollection(newFilteredCollection);
    }, [collections, selectedStation, selectedWorker, selectedVehicle]);

    const filteredTotalCollected = filteredCollection.reduce((total, collection) => total + collection.amount, 0);

    return collections.length > 0 ? (
        <div className="mx-auto mt-5 md:mt-10 w-[90%] md:w-[80%] pb-30 md:pb-40">
            <button
                onClick={() => setShowFilter(prev => !prev)}
                className={`md:hidden p-0.75 md:p-1 rounded border border-gray-400 text-xs
                    ml-5 ${showFilter ? "mb-2" : "mb-5"}`}
            >
                {showFilter ? "Close" : "Filters"}
            </button>

            <div className={showFilter ? "ml-5" : "max-md:hidden ml-5 mb-5"}>
                <div className="max-md:mb-3 flex max-md:flex-col items-start md:items-center gap-2">
                    <select
                        onChange={(e) => setSelectedStation(e.target.value)}
                        className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                    >
                        <option value="">All Stations</option>
                        {stations.map((station) => (
                            <option key={station.id} value={station.id}>{station.name}</option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setSelectedWorker(e.target.value)}
                        className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                    >
                        <option value="">All Workers</option>
                        {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>{worker.firstName} {worker.lastName}</option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        className="border border-gray-400 rounded p-1 md:p-2 text-xs md:text-sm"
                    >
                        <option value="">All Types</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>{vehicle.type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex max-md:flex-col items-center justify-center gap-3 mb-15">
                <div className="flex items-center justify-center gap-2">
                    <Image
                        src="/total_money.svg"
                        alt="Total Money"
                        width={40}
                        height={40}
                        className="size-10"
                    />
                    <h2 className="text-2xl font-semibold text-slate-700">Total Collected:</h2>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">${filteredTotalCollected}</h2>
            </div>

            <div className="flex max-md:flex-col items-center justify-center gap-2 mb-10">
                <Image
                    src="/money.svg"
                    alt="Total Money"
                    width={40}
                    height={40}
                    className="size-10"
                />
                <h2 className="text-2xl font-semibold text-center text-slate-700">Collected by workers</h2>
            </div>

            <table className="w-full border-collapse text-center">
                <thead>
                    <tr className="border-b max-md:text-xs">
                        <th className="max-md:hidden">Date</th>
                        <th>Station</th>
                        <th>Worker</th>
                        <th>Vehicle</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCollection.map((collection) => (
                        <tr key={collection.id} className="border-b">
                            <td className="max-md:text-xs py-3 max-md:hidden">
                                {new Date(collection.createdAt).toLocaleString()}
                            </td>
                            <td className="max-md:text-xs py-3">{collection.station.name}</td>
                            <td className="max-md:text-xs py-3">
                                {collection.worker.firstName} {collection.worker.lastName}
                            </td>
                            <td className="max-md:text-xs py-3">{collection.vehicle.brand}</td>
                            <td className="max-md:text-xs py-3">
                                {collection.vehicle.type.charAt(0) + collection.vehicle.type.slice(1).toLowerCase()}
                            </td>
                            <td className="max-md:text-xs py-3">{collection.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <h1 className="text-center text-2xl md:text-3xl mt-10 md:mt-20 text-slate-700">No collected tolls yet.</h1>
    )
}

export default page
