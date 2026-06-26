import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({
    leaveRequests = [],
    status = '申請中',
}) {

    const changeStatus = (e) => {

        router.get(
            '/leave-requests',
            {
                status: e.target.value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <MainLayout>

            <Head title="届出一覧" />

            <div className="max-w-5xl mx-auto p-8">

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    "
                >

                    <h1 className="text-3xl font-bold">
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

                </div>

                {/* ステータス絞り込み */}
                <div className="mb-4">

                    <label className="font-bold mr-3">
                        ステータス
                    </label>

                    <select
                        value={status}
                        onChange={changeStatus}
                        className="
                            border
                            p-2
                            rounded
                        "
                    >
                        <option value="申請中">
                            申請中
                        </option>

                        <option value="承認済">
                            承認済
                        </option>

                        <option value="差戻">
                            差戻
                        </option>

                        <option value="未申請">
                            未申請
                        </option>

                        <option value="すべて">
                            すべて
                        </option>

                    </select>

                </div>

                <table className="w-full border mt-6">

                    <thead className="bg-gray-200">

                        <tr>

                            <th className="border p-2">
                                申請日時
                            </th>

                            <th className="border p-2">
                                区分
                            </th>

                            <th className="border p-2">
                                対象日
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

                                            {
                                                new Date(
                                                    request.created_at
                                                ).toLocaleString(
                                                    'ja-JP',
                                                    {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                    }
                                                )
                                            }

                                        </td>

                                        <td className="border p-2">
                                            {request.request_type}
                                        </td>

                                        <td className="border p-2">
                                            {request.start_date}
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