import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Index({
    attendances,
    month
}) {

    return (
        <MainLayout>
            <Head title="勤怠一覧" />

            <div className="max-w-6xl mx-auto bg-white shadow rounded p-8">

                <h1 className="text-3xl font-bold mb-8">
                    勤怠一覧
                </h1>

                <div className="mb-6">
                    <label className="font-bold mr-3">
                        対象月
                    </label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) =>
                            router.get(
                                '/attendances',
                                {
                                    month: e.target.value
                                }
                            )
                        }
                        className="border p-2 rounded"
                    />
                </div>

                <table className="w-full border">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="border p-2">日付</th>
                            <th className="border p-2">勤務区分</th>
                            <th className="border p-2">出勤時刻</th>
                            <th className="border p-2">退勤時刻</th>
                            <th className="border p-2">交通費</th>
                            <th className="border p-2">申請状況</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            attendances.map(
                                (attendance) => (
                                    <tr key={attendance.id}>
                                        <td>
                                            <Link
                                                href={`/daily-attendance/${attendance.work_date}`}
                                                className="
                                                    text-blue-600
                                                    underline
                                                "
                                            >
                                                {attendance.work_date}
                                            </Link>
                                        </td>
                                        <td className="border p-2">
                                            {attendance.work_type}
                                        </td>
                                        <td className="border p-2">
                                            {attendance.start_time}
                                        </td>
                                        <td className="border p-2">
                                            {attendance.end_time}
                                        </td>
                                        <td className="border p-2">
                                            {attendance.transportation_fee}円
                                        </td>
                                        <td className="border p-2">
                                            {attendance.status}
                                        </td>

                                    </tr>
                                )
                            )
                        }

                    </tbody>

                </table>

            </div>
        </MainLayout>
    );
}