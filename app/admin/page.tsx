"use client"

import api from "@/utils/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type RecentCollections = {
  id: number;
  amount: number;
  createdAt: string | Date;
  worker: {
    firstName: string;
    lastName: string;
  };
  vehicle: {
    brand: string;
    model: string;
  };
  station: {
    name: string;
  }
};

const Dashboard = () => {
  const [owners, setOwners] = useState(0);
  const [stations, setStations] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [collections, setCollections] = useState(0);
  const [totalTotalRevenue, setTotalRevenue] = useState(0);
  const [recentCollections, setRecentCollections] = useState<RecentCollections[]>([]);

  const fetchCollections = async () => {
    try {
      const { data } = await api.get("/admin/dashboard/collections");
      if (data.success) {
        setOwners(data.owners);
        setStations(data.stations);
        setWorkers(data.workers);
        setCollections(data.collections);
        setTotalRevenue(data.totalRevenue);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const fetchRecentCollections = async () => {
    try {
      const { data } = await api.get("/admin/dashboard/recentCollections");
      if (data.success) {
        setRecentCollections(data.recentCollections);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchRecentCollections();
  }, []);

  return (
    <div className='mt-10 md:mt-20 mb-30 md:mb-40'>
      <h1 className="text-xl md:text-2xl text-center text-slate-800">Toll System Overview</h1>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10 mt-8 md:mt-10 mb-10 md:mb-20">
        <div
          className="flex items-center justify-center p-2 md:p-3 active:scale-95 transition text-sm
            text-slate-800 border rounded-lg bg-transparent"
        >
          <p className="">Total Owners: {owners}</p>
        </div>
        <div
          className="flex items-center justify-center p-2 md:p-3 active:scale-95 transition text-sm
            text-slate-800 border rounded-lg bg-transparent"
        >
          <p className="">Toll Stations: {stations}</p>
        </div>
        <div
          className="flex items-center justify-center p-2 md:p-3 active:scale-95 transition text-sm
            text-slate-800 border rounded-lg bg-transparent"
        >
          <p className="">Active Workers: {workers}</p>
        </div>
        <div
          className="flex items-center justify-center p-2 md:p-3 active:scale-95 transition text-sm
            text-slate-800 border rounded-lg bg-transparent"
        >
          <p className="">Total Collections: {collections}</p>
        </div>
        <div
          className="flex items-center justify-center p-2 md:p-3 active:scale-95 transition text-sm
            text-slate-800 border rounded-lg bg-transparent"
        >
          <p className="">Revenue Collected: ${totalTotalRevenue}</p>
        </div>
      </div>

      <h1 className="text-xl md:text-2xl text-center text-slate-800">Recent collections</h1>
      <table className="md:max-w-[80%] mx-auto w-full mt-3 md:mt-8 border-collapse text-center">
        <thead className="max-md:text-sm">
          <tr className="border-b">
            <th className="max-md:hidden">Date</th>
            <th>Worker</th>
            <th>Vehicle</th>
            <th>Station</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody className="max-md:text-xs">
          {recentCollections.map((collection) => (
            <tr key={collection.id} className="border-b">
              <td className="md:p-3 max-md:hidden">
                {new Date(collection.createdAt).toLocaleString()}
              </td>

              <td className="md:p-3">
                {collection.worker.firstName}{" "}
                {collection.worker.lastName}
              </td>

              <td className="md:p-3">
                {collection.vehicle.brand}{" "}
                {collection.vehicle.model}
              </td>

              <td className="md:p-3">
                {collection.station.name}
              </td>

              <td className="md:p-3">
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
