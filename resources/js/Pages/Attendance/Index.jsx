import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Index({
    attendances,
    month,
    workType: initialWorkType,
    status: initialStatus
}) {

    const [workType, setWorkType] = useState(
        initialWorkType ?? ''
    );

    const [status, setStatus] = useState(
        initialStatus ?? ''
    );

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

            alert('更新に失敗しました');
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
                        "
                    >
                        <option value="">
                            全勤務区分
                        </option>
                        <option value="出勤">
                            出勤
                        </option>
                        <option value="振出">
                            振出
                        </option>
                        <option value="欠勤">
                            欠勤
                        </option>
                        <option value="有給">
                            有給
                        </option>
                        <option value="特休">
                            特休
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
                        <option value="差戻し">
                            差戻し
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
                            attendances.length > 0
                                ? attendances.map(
                                    (
                                        attendance
                                    ) => (
                                        <tr
                                            key={
                                                attendance.id
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
                                                    attendance.work_type
                                                }
                                            </td>

                                            <td className="border p-2">
                                                {
                                                    attendance.start_time
                                                }
                                            </td>

                                            <td className="border p-2">
                                                {
                                                    attendance.end_time
                                                }
                                            </td>

                                            <td className="border p-2">
                                                {
                                                    attendance.transportation_fee
                                                }円
                                            </td>

                                            <td className="border p-2">
                                                {
                                                    attendance.status
                                                }
                                            </td>

                                            <td className="border p-2">

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

                                            </td>
                                        </tr>
                                    )
                                )
                                : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="
                                                border
                                                p-4
                                                text-center
                                            "
                                        >
                                            データがありません
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}