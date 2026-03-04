import { useGetAllOfflineTitheQuery } from "@/redux/features/give/titheApi";
import { useGetAllOfferingQuery } from "@/redux/features/give/offeringApi";
import { useMemo } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";


type Props = {}

export default function TransactionCalculation({}: Props) {
    const { data: tithesData } = useGetAllOfflineTitheQuery({});
    const { data: offeringsData } = useGetAllOfferingQuery({});
  
    const breakdown = useMemo(() => {
      const initialStructure:any = {
        NGN: { tithes: 0, offerings: 0, titheCount: 0, offeringCount: 0 },
        USD: { tithes: 0, offerings: 0, titheCount: 0, offeringCount: 0 }
      };
  
      // Process Offline Tithes
      tithesData?.offerings?.forEach((t:any) => {
        initialStructure[t.currency].tithes += t.amount;
        initialStructure[t.currency].titheCount++;
      });
  
      // Process Online Offerings
      offeringsData?.offerings?.forEach((o:any) => {
        initialStructure[o.currency].offerings += o.amount;
        initialStructure[o.currency].offeringCount++;
      });
  
      return initialStructure;
    }, [tithesData, offeringsData]);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Naira Breakdown */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMoneyBill className="text-green-600" />
            Naira (NGN) Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Offline Tithes:</span>
              <div className="text-right">
                <p className="font-medium">₦{breakdown.NGN.tithes.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {breakdown.NGN.titheCount} transactions
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Online Offerings:</span>
              <div className="text-right">
                <p className="font-medium">₦{breakdown.NGN.offerings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {breakdown.NGN.offeringCount} transactions
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total NGN:</span>
                <div className="text-right">
                  <p>₦{(breakdown.NGN.tithes + breakdown.NGN.offerings).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {breakdown.NGN.titheCount + breakdown.NGN.offeringCount} total transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Dollar Breakdown */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaDollarSign className="text-blue-600" />
            Dollar (USD) Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Offline Tithes:</span>
              <div className="text-right">
                <p className="font-medium">${breakdown.USD.tithes.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {breakdown.USD.titheCount} transactions
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Online Offerings:</span>
              <div className="text-right">
                <p className="font-medium">${breakdown.USD.offerings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {breakdown.USD.offeringCount} transactions
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total USD:</span>
                <div className="text-right">
                  <p>${(breakdown.USD.tithes + breakdown.USD.offerings).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {breakdown.USD.titheCount + breakdown.USD.offeringCount} total transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };