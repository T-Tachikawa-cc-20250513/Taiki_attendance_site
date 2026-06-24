import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    leaveRequests = [],
}) {

    return (
        <MainLayout>

            <Head title="届出一覧" />

            <div className="max-w-5xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-6">
                    届出一覧
                </h1>

                <Link
                    href="/leave-request/create"
                    className="
                        bg-blue-500
                        text-white
                        px-4
                        py-2
                        rounded
                    "
                >
                    新規届出
                </Link>

                <table className="w-full border mt-6">

                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">
                                区分
                            </th>

                            <th className="border p-2">
                                開始日
                            </th>

                            <th className="border p-2">
                                終了日
                            </th>

                            <th className="border p-2">
                                状態
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {leaveRequests.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center p-4"
                                >
                                    データがありません
                                </td>
                            </tr>

                        ) : (

                            leaveRequests.map(
                                (request) => (

                                    <tr key={request.id}>

                                        <td className="border p-2">
                                            {request.request_type}
                                        </td>

                                        <td className="border p-2">
                                            {request.start_date}
                                        </td>

                                        <td className="border p-2">
                                            {request.end_date}
                                        </td>

                                        <td className="border p-2">
                                            {request.status}
                                        </td>

                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </MainLayout>
    );
}