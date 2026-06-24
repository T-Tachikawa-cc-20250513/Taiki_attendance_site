import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Index({
    attendances,
    month,
    workType: initialWorkType,
    status: initialStatus,
    monthlyTransportationFee,
    workDays,
    totalWorkHours,
    applyingCount,
    approvedCount,
    hasUnapplied
}) {

    const [workType, setWorkType] = useState(
        initialWorkType ?? ''
    );

    const [status, setStatus] = useState(
        initialStatus ?? ''
    );

    const isBulkApplied = !hasUnapplied;

    const moveMonth = (diff) => {

        const currentDate = new Date(
            month + '-01'
        );

        currentDate.setMonth(
            currentDate.getMonth() + diff
        );

        const nextMonth =
            currentDate
                .toISOString()
                .slice(0, 7);

        router.get(
            '/attendances',
            {
                month: nextMonth,
                work_type: workType,
                status: status,
            }
        );
    };

    const searchAttendances = () => {

        router.get(
            '/attendances',
            {
                month,
                work_type: workType,
                status,
            }
        );
    };

    const toggleStatus = async (id) => {

        try {

            await axios.post(
                `/daily-attendance/${id}/toggle-status`
            );

            router.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '更新に失敗しました'
            );
        }
    };

    // 一括申請／一括申請取消
    const bulkApply = async () => {

        try {

            const [year, targetMonth] =
                month.split('-');

            const response = await axios.post(
                '/daily-attendance/bulk-apply',
                {
                    year: Number(year),
                    month: Number(targetMonth),
                }
            );

            alert(
                response.data.message
            );

            router.reload();

        } catch (error) {

            console.log('ERROR', error);

            if (error.response?.data?.message) {

                alert(
                    error.response.data.message
                );

            } else {

                alert(
                    '一括申請処理に失敗しました'
                );
            }
        }
    };

    return (
        <MainLayout>
            <Head title="勤怠一覧" />

            <div className="max-w-6xl mx-auto bg-white shadow rounded p-8">

                <h1 className="text-3xl font-bold text-center mb-10">
                    勤怠一覧画面
                </h1>

                {/* 月切替 */}
                <div className="flex items-center gap-4 mb-8">

                    <button
                        onClick={() => moveMonth(-1)}
                        className="
                            bg-gray-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        ← 前月
                    </button>

                    <input
                        type="month"
                        value={month}
                        onChange={(e) =>
                            router.get(
                                '/attendances',
                                {
                                    month: e.target.value,
                                    work_type: workType,
                                    status: status,
                                }
                            )
                        }
                        className="border rounded p-2"
                    />

                    <button
                        onClick={() => moveMonth(1)}
                        className="
                            bg-gray-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        次月 →
                    </button>
                </div>

                {/* 検索条件 */}
                <div className="flex gap-4 mb-8">

                    <select
                        value={workType}
                        onChange={(e) =>
                            setWorkType(
                                e.target.value
                            )
                        }
                        className="
                            border
                            rounded
                            p-2
                            w-40
                        "
                    >
                        <option value="">
                            全勤務区分
                        </option>

                        <option value="出勤">
                            出勤
                        </option>

                        <option value="公休">
                            公休
                        </option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                        className="
                            border
                            rounded
                            p-2
                            w-40
                        "
                    >
                        <option value="">
                            全申請状況
                        </option>

                        <option value="未申請">
                            未申請
                        </option>

                        <option value="申請中">
                            申請中
                        </option>

                        <option value="承認済">
                            承認済
                        </option>

                        <option value="差戻">
                            差戻
                        </option>
                    </select>

                    <button
                        onClick={searchAttendances}
                        className="
                            bg-blue-500
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        検索
                    </button>

                    <button
                        onClick={bulkApply}
                        className={`
                            text-white
                            px-4
                            py-2
                            rounded
                            ${
                                isBulkApplied
                                    ? 'bg-red-500'
                                    : 'bg-green-500'
                            }
                        `}
                    >
                        {
                            isBulkApplied
                                ? '一括申請取消'
                                : '一括申請'
                        }
                    </button>

                </div>

                {/* 一覧 */}
                <table className="w-full border">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="border p-2">
                                日付
                            </th>

                            <th className="border p-2">
                                勤務区分
                            </th>

                            <th className="border p-2">
                                出勤時刻
                            </th>

                            <th className="border p-2">
                                退勤時刻
                            </th>

                            <th className="border p-2">
                                休憩時間
                            </th>

                            <th className="border p-2">
                                交通費
                            </th>

                            <th className="border p-2">
                                申請状況
                            </th>

                            <th className="border p-2">
                                操作
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                    {
                        attendances.map(
                            (attendance) => (

                                <tr
                                    key={
                                        attendance.work_date
                                    }
                                >

                                    <td className="border p-2">
                                        <Link
                                            href={`/daily-attendance/${attendance.work_date}`}
                                            className="
                                                text-blue-600
                                                underline
                                            "
                                        >
                                            {
                                                attendance.work_date
                                            }
                                        </Link>
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.work_type ?? ''
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.start_time ?? ''
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.end_time ?? ''
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.break_minutes > 0
                                                ? `${attendance.break_minutes / 60}時間`
                                                : ''
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.transportation_fee > 0
                                                ? `${attendance.transportation_fee}円`
                                                : ''
                                        }
                                    </td>

                                    <td className="border p-2">
                                        {
                                            attendance.status
                                        }
                                    </td>

                                    <td className="border p-2">

                                        {
                                            attendance.id &&
                                            (
                                                attendance.status === '未申請' ||
                                                attendance.status === '申請中'
                                            ) && (

                                                <button
                                                    onClick={() =>
                                                        toggleStatus(
                                                            attendance.id
                                                        )
                                                    }
                                                    className={`
                                                        text-white
                                                        px-3
                                                        py-1
                                                        rounded
                                                        ${
                                                            attendance.status === '申請中'
                                                                ? 'bg-red-500'
                                                                : 'bg-green-500'
                                                        }
                                                    `}
                                                >
                                                    {
                                                        attendance.status === '申請中'
                                                            ? '申請取消'
                                                            : '申請'
                                                    }
                                                </button>

                                            )
                                        }

                                    </td>

                                </tr>

                            )
                        )
                    }

                    </tbody>

                </table>

                {/* 月間集計 */}
                <div className="mt-8 border rounded p-6 bg-gray-100">

                    <h2 className="text-xl font-bold mb-5">
                        月間集計
                    </h2>

                    <div className="grid grid-cols-2 gap-y-4">

                        <div>
                            出勤日数：
                            <span className="font-bold">
                                {workDays}日
                            </span>
                        </div>

                        <div>
                            総勤務時間：
                            <span className="font-bold">
                                {totalWorkHours}
                            </span>
                        </div>

                        <div>
                            月間交通費合計：
                            <span className="font-bold">
                                {monthlyTransportationFee}円
                            </span>
                        </div>

                        <div>
                            申請中件数：
                            <span className="font-bold text-orange-600">
                                {applyingCount}件
                            </span>
                        </div>

                        <div>
                            承認済件数：
                            <span className="font-bold text-green-600">
                                {approvedCount}件
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}