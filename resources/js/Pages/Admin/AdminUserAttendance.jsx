import { useState } from 'react';
import axios from 'axios';
import AdminLayout
    from '@/Layouts/AdminLayout';

export default function AdminUserAttendance({
    attendances = [],
    month: initialMonth,
    userId,
}) {

    const [
        attendanceList,
        setAttendanceList
    ] = useState(attendances);

    const [
        statusFilter,
        setStatusFilter
    ] = useState('申請中');

    const [month, setMonth] =
        useState(initialMonth);

    const loadMonthData = async (
        targetMonth,
        targetStatus = statusFilter
    ) => {

        try {

            const response =
                await axios.get(
                    '/admin/attendances',
                    {
                        params: {
                            month: targetMonth,
                            status: targetStatus,
                            user_id: userId,
                        },
                    }
                );

            setAttendanceList(
                response.data
            );

        } catch {

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

            loadMonthData(
                month,
                statusFilter
            );

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

            loadMonthData(
                month,
                statusFilter
            );

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

            const response =
                await axios.post(
                    '/admin/bulk-approve',
                    {
                        month,
                        user_id: userId,
                    }
                );

            alert(
                response.data.message
            );

            loadMonthData(
                month,
                statusFilter
            );

        } catch (error) {

            console.log(
                error.response
            );

            alert(
                error.response?.data?.message
                ?? '一括承認失敗'
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
        <AdminLayout
            showDashboardLink
        >
            <div className="p-8">

                <h2
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >
                    勤怠承認画面
                </h2>

                <div className="flex gap-3 mb-6 flex-wrap">

                    <input
                        type="month"
                        value={month}
                        onChange={(e) => {

                            const value =
                                e.target.value;

                            setMonth(
                                value
                            );

                            loadMonthData(
                                value,
                                statusFilter
                            );
                        }}
                        className="border p-2"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {

                            const value =
                                e.target.value;

                            setStatusFilter(
                                value
                            );

                            loadMonthData(
                                month,
                                value
                            );
                        }}
                        className="border p-2"
                    >
                        <option value="">
                            全件
                        </option>

                        <option value="申請中">
                            承認待ち
                        </option>

                        <option value="承認済">
                            承認済
                        </option>

                        <option value="差戻">
                            差戻
                        </option>
                    </select>

                    <button
                        onClick={bulkApprove}
                        className="
                            bg-green-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        一括承認
                    </button>

                    <button
                        onClick={closeMonth}
                        className="
                            bg-red-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        月締
                    </button>

                    <button
                        onClick={exportCsv}
                        className="
                            bg-blue-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        CSV出力
                    </button>

                    <button
                        onClick={exportPdf}
                        className="
                            bg-purple-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
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

                        {attendanceList.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="
                                        text-center
                                        py-8
                                    "
                                >
                                    対象データなし
                                </td>

                            </tr>

                        ) : (

                            attendanceList.map(
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

                                        <td>

                                            {attendance.status === '申請中' && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            approve(
                                                                attendance.id
                                                            )
                                                        }
                                                        className="
                                                            bg-green-500
                                                            text-white
                                                            px-2
                                                            py-1
                                                            rounded
                                                        "
                                                    >
                                                        承認
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            reject(
                                                                attendance.id
                                                            )
                                                        }
                                                        className="
                                                            bg-red-500
                                                            text-white
                                                            px-2
                                                            py-1
                                                            rounded
                                                        "
                                                    >
                                                        差戻
                                                    </button>
                                                </>
                                            )}

                                        </td>

                                    </tr>

                                )
                            )

                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}