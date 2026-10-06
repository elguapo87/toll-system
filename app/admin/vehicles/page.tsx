"use client"

import api from "@/utils/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Station = {
  id: number;
  name: string;
};

type Vehicle = {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  type: string;
  stations: Station[];
  collections: number;
  revenue: number;
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get("/admin/dashboard/vehicles");
      if (data.success) {
        setVehicles(data.vehicles);
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
    fetchVehicles();
  }, []);

  const vehiclesByStation = vehicles.reduce(
    (groups, vehicle) => {
      vehicle.stations.forEach((station) => {
        if (!groups[station.id]) {
          groups[station.id] = {
            id: station.id,
            name: station.name,
            vehicles: []
          };
        }

        groups[station.id].vehicles.push(vehicle);
      });

      return groups;
    },
    {} as Record<
      number,
      {
        id: number;
        name: string;
        vehicles: Vehicle[]
      }
    >
  );

  return (
    <div className='mt-10 md:mt-20 mb-30 md:mb-40'>
      {Object.values(vehiclesByStation).map((station) => (
        <div key={station.id} className="mb-10 md:mb-15">
          <h1 className="text-lg md:text-2xl text-center text-slate-800 mb-3 md:mb-5">
            {station.name}
          </h1>

          <table className="md:max-w-[80%] mx-auto w-full border-collapse text-center">
            <thead className="max-md:text-xs">
              <tr className="border-b">
                <th className="max-md:max-w-12.5">Vehicle</th>
                <th className="max-md:max-w-12.5">License Plate</th>
                <th className="max-md:max-w-12.5">Type</th>
                <th className="max-md:max-w-12.5">Collections</th>
                <th className="max-md:max-w-12.5">Revenue</th>
              </tr>
            </thead>

            <tbody className="max-md:text-xs">
              {station.vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b">
                  <td className="md:p-3 max-md:max-w-12.5">
                    <Link href={`/admin/vehicle/${vehicle.id}`}>
                      {vehicle.brand} {vehicle.model}
                    </Link>
                  </td>

                  <td className="md:p-3 max-md:max-w-12.5">{vehicle.licensePlate}</td>

                  <td className="md:p-3 max-md:max-w-12.5">{vehicle.type}</td>

                  <td className="md:p-3 max-md:max-w-12.5">{vehicle.collections}</td>

                  <td className="md:p-3 max-md:max-w-12.5">{vehicle.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default Vehicles
