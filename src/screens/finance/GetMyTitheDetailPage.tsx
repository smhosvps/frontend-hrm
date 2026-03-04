import { useParams } from "react-router-dom";
import { FaNairaSign, FaDollarSign } from "react-icons/fa6";
import { useGetTitheByNumberQuery } from "@/redux/features/give/titheApi";

type Props = {}

export default function GetMyTitheDetailPage({}: Props) {
    const { tithe_number } = useParams();
    console.log(tithe_number)
    const { data: tithe, isLoading, isError } = useGetTitheByNumberQuery(tithe_number || "");

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tithe details</div>;
    if (!tithe) return <div>No tithe found</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Tithe Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">Tithe Number: {tithe?.tithe_number}</p>
                    <p className="flex items-center">
                        {tithe?.currency === 'NGN' ? (
                            <FaNairaSign className="mr-2" />
                        ) : (
                            <FaDollarSign className="mr-2" />
                        )}
                        {tithe.amount.toLocaleString()}
                    </p>
                    <p>Month: {tithe?.month}</p>
                    <p>Branch: {tithe?.branch}</p>
                </div>
                
                {tithe.user && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Member Details</h3>
                        <p>Name: {tithe?.user?.firstName} {""} {tithe?.user?.lastName}</p>
                        <p>Email: {tithe?.user?.email}</p>
                        <p>Phone: {tithe?.user?.phoneNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

