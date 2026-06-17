import { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard({
    attendances = [],
}) {

    const [month, setMonth] =
        useState(
            new Date()
                .toISOString()
                .slice(0, 7)
        );

    const loadMonthData = async (
        targetMonth
    ) => {

        try {

            const response =
                await axios.get(
                    '/admin/attendances',
                    {
                        params: {
                            month:
                                targetMonth,
                        },
                    }
                );

            console.log(
                response.data
            );

        } catch (error) {

            alert(
                '取得失敗'
            );
        }
    };

    const approve = async (id) => {

        try {

            await axios.post(
                `/admin/attendance/${id}/approve`
            );

            alert(
                '承認しました'
            );

            location.reload();

        } catch {

            alert(
                '承認失敗'
            );
        }
    };

    const reject = async (id) => {

        const reason =
            prompt(
                '差し戻し理由'
            );

        if (!reason) return;

        try {

            await axios.post(
                `/admin/attendance/${id}/reject`,
                {
                    reason,
                }
            );

            alert(
                '差し戻しました'
            );

            location.reload();

        } catch {

            alert(
                '差し戻し失敗'
            );
        }
    };

    const bulkApprove = async () => {

        if (
            !confirm(
                '一括承認しますか？'
            )
        ) {
            return;
        }

        try {

            await axios.post(
                '/admin/bulk-approve',
                {
                    month,
                }
            );

            alert(
                '一括承認しました'
            );

            location.reload();

        } catch {

            alert(
                '一括承認失敗'
            );
        }
    };

    const closeMonth = async () => {

        if (
            !confirm(
                '月締しますか？'
            )
        ) {
            return;
        }

        try {

            await axios.post(
                '/admin/month-close',
                {
                    month,
                }
            );

            alert(
                '月締完了'
            );

            location.reload();

        } catch {

            alert(
                '月締失敗'
            );
        }
    };

    const exportCsv = () => {

        window.open(
            `/admin/export/csv?month=${month}`
        );
    };

    const exportPdf = () => {

        window.open(
            `/admin/export/pdf?month=${month}`
        );
    };

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                管理画面
            </h1>

            <div className="flex gap-3 mb-6">

                <input
                    type="month"
                    value={month}
                    onChange={(e) => {

                        setMonth(
                            e.target.value
                        );

                        loadMonthData(
                            e.target.value
                        );
                    }}
                    className="border p-2"
                />

                <button
                    onClick={bulkApprove}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    一括承認
                </button>

                <button
                    onClick={closeMonth}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    月締
                </button>

                <button
                    onClick={exportCsv}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    CSV出力
                </button>

                <button
                    onClick={exportPdf}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    PDF出力
                </button>

            </div>

            <table className="w-full border">

                <thead>

                    <tr className="bg-gray-200">

                        <th>社員</th>
                        <th>日付</th>
                        <th>勤務区分</th>
                        <th>実働</th>
                        <th>残業</th>
                        <th>深夜</th>
                        <th>状態</th>
                        <th>操作</th>

                    </tr>

                </thead>

                <tbody>

                    {attendances.map(
                        (
                            attendance
                        ) => (

                            <tr
                                key={
                                    attendance.id
                                }
                            >

                                <td>
                                    {
                                        attendance.user
                                            ?.name
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.work_date
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.work_type
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.actual_work_minutes
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.overtime_minutes
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.late_night_minutes
                                    }
                                </td>

                                <td>
                                    {
                                        attendance.status
                                    }
                                </td>

                                <td className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            approve(
                                                attendance.id
                                            )
                                        }
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                        承認
                                    </button>

                                    <button
                                        onClick={() =>
                                            reject(
                                                attendance.id
                                            )
                                        }
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        差戻
                                    </button>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}