"use client"

import Loader from "@/components/Loader";
import api from "@/utils/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type RecentCollections = {
  id: number;
  amount: number;
  workerId: number;
  vehicleId: number;
  stationId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  worker: {
    id: number;
    firstName: string;
    lastName: string;
    collectedAmount: number;
    stationId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  vehicle: {
    id: number;
    type: string;
    brand: string;
    model: string;
    color: string;
    hasTrailer: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  station: {
    id: number;
    name: string;
    ownerId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
};

const Dashboard = () => {

  const [stations, setStations] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [vehicles, setVehicles] = useState(0);
  const [collections, setCollections] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [recentCollections, setRecentCollections] = useState<RecentCollections[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/guest/dashboard/summary");
      if (data.success) {
        setStations(data.stations);
        setWorkers(data.workers);
        setVehicles(data.vehicles);
        setCollections(data.collections);
        setTotalCollected(data.totalCollected);
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentCollections = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/guest/dashboard/recent");
      if (data.success) {
        setRecentCollections(data.recentCollections);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    fetchRecentCollections();
  }, []);

  if (loading) return <Loader />

  return (
    <div className="mx-auto text-center w-[90%] md:w-[80%] mt-5 md:-translate-y-1/2 max-md:mb-10">
      <h1 className="text-2xl md:text-3xl">Toll System Overview</h1>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-10 mt-10 mb-20">
        <div
          className="w-40 py-3 active:scale-95 transition text-sm text-gray-500 border rounded-lg bg-transparent">
          <p className="">Stations: {stations}</p>
        </div>

        <div
          className="w-40 py-3 active:scale-95 transition text-sm text-gray-500 border rounded-lg bg-transparent">
          <p className="">Workers: {workers}</p>
        </div>

        <div
       
          className="w-40 py-3 active:scale-95 transition text-sm text-gray-500 border rounded-lg bg-transparent">
          <p className="">Vehicles: {vehicles}</p>
        </div>

        <div
          className="w-40 py-3 active:scale-95 transition text-sm text-gray-500 border rounded-lg bg-transparent">
          <p className="">Collections: {collections}</p>
        </div>

        <div
          className="w-40 py-3 active:scale-95 transition text-sm text-gray-500 border rounded-lg bg-transparent">
          <p className="">Revenue: ${totalCollected}</p>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl">Recent Toll Collections</h1>


      <table className="md:max-w-[80%] mx-auto w-full mt-8 border-collapse text-center">
        <thead>
          <tr className="border-b max-md:text-xs">
            <th className="max-md:hidden">Date</th>
            <th>Worker</th>
            <th>Vehicle</th>
            <th>Station</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {recentCollections.map((collection) => (
            <tr key={collection.id} className="border-b">
              <td className="max-md:hidden max-md:text-xs py-3">
                {new Date(collection.createdAt).toLocaleString()}
              </td>

              <td className="max-md:text-xs py-3">
                {collection.worker.firstName}{" "}
                {collection.worker.lastName}
              </td>

              <td className="max-md:text-xs py-3">
                {collection.vehicle.brand}{" "}
                {collection.vehicle.model}
              </td>

              <td className="max-md:text-xs py-3">
                {collection.station.name}
              </td>

              <td className="max-md:text-xs py-3">
                ${collection.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
