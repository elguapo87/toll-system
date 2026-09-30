"use client"

import api from "@/utils/axios";
import axios from "axios";
import Image from "next/image";
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
  };
};

const Dashboard = () => {
  const [stations, setStations] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [recentCollections, setRecentCollections] = useState<RecentCollections[]>([]);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/owner/dashboard");
      if (data.success) {
        setStations(data.stations);
        setWorkers(data.workers)
        setTotalRevenue(data.totalRevenue);
        setTodayRevenue(data.todayRevenue);
        setRecentCollections(data.recentCollections);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto w-[90%] md:w-[80%] mt-10 md:mt-15 max-md:pb-30 pb-40">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-md:gap-x-0 gap-10 mb-10 md:mb-30">
        <div className="flex flex-col items-center justify-center max-w-80">
          <div className="p-6 aspect-square bg-violet-100 rounded-full">
            <Image
              src="/house.svg"
              alt="Toll"
              width={30}
              height={30}
            />
          </div>
          <div className="mt-5 space-y-2 text-center">
            <h1 className="font-semibold text-slate-700 text-2xl">Stations</h1>
            <p className="font-semibold text-base text-slate-600">{stations}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-80">
          <div className="p-6 aspect-square bg-green-100 rounded-full">
            <Image
              src="/worker.svg"
              alt="Toll"
              width={30}
              height={30}
            />
          </div>
          <div className="mt-5 space-y-2 text-center">
            <h1 className="font-semibold text-slate-700 text-2xl">Workers</h1>
            <p className="text-base text-slate-600">{workers}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-80">
          <div className="p-6 aspect-square bg-orange-100 rounded-full">
            <Image
              src="/total_money.svg"
              alt="Toll"
              width={30}
              height={30}
            />
          </div>
          <div className="mt-5 space-y-2 text-center">
            <h1 className="font-semibold text-slate-700 text-2xl">Total Revenue</h1>
            <p className="text-base text-slate-600">${totalRevenue}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-80">
          <div className="p-6 aspect-square bg-orange-100 rounded-full">
            <Image
              src="/money.svg"
              alt="Toll"
              width={30}
              height={30}
            />
          </div>
          <div className="mt-5 space-y-2 text-center">
            <h1 className="font-semibold text-slate-700 text-2xl">Today Revenue</h1>
            <p className="text-base text-slate-600">${todayRevenue}</p>
          </div>
        </div>
      </div>

      {recentCollections.length > 0 && (
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="border-b max-md:text-xs">
              <th>Date</th>
              <th>Worker</th>
              <th>Vehicle</th>
              <th>Station</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentCollections.map((collection) => (
              <tr key={collection.id} className="border-b">
                <td className="max-md:text-xs py-3">
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
      )}
    </div>
  )
}

export default Dashboard
