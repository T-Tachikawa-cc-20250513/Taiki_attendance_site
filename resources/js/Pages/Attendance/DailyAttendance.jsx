import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DailyAttendance({
    todayIn,
    todayOut,
    attendance,
    targetDate
}) {
    const { auth } = usePage().props;

    const [startTime, setStartTime] = useState(
        attendance?.start_time
            ?? (
                todayIn
                    ? new Date(todayIn).toLocaleTimeString(
                        'ja-JP',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }
                    )
                    : ''
            )
    );

    const [endTime, setEndTime] = useState(
        attendance?.end_time
            ?? (
                todayOut
                    ? new Date(todayOut).toLocaleTimeString(
                        'ja-JP',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }
                    )
                    : ''
            )
    );

    const [workType, setWorkType] = useState(
        attendance?.work_type ?? '出勤'
    );
    const [office, setOffice] = useState(
        attendance?.office ?? 'SES'
    );
    const [transportationFee, setTransportationFee] = useState(
        attendance?.transportation_fee ?? 0
    );
    const [remark, setRemark] = useState(
        attendance?.remark ?? ''
    );
    const [status, setStatus] = useState(
        attendance?.status ?? '未申請'
    );

    useEffect(() => {
        setStartTime(
            attendance?.start_time
            ?? (
                todayIn
                    ? new Date(todayIn).toLocaleTimeString(
                        'ja-JP',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }
                    )
                    : ''
            )
        );
        setEndTime(
            attendance?.end_time
            ?? (
                todayOut
                    ? new Date(todayOut).toLocaleTimeString(
                        'ja-JP',
                        {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }
                    )
                    : ''
            )
        );
        setWorkType(
            attendance?.work_type ?? '出勤'
        );
        setOffice(
            attendance?.office ?? 'SES'
        );
        setTransportationFee(
            attendance?.transportation_fee ?? 0
        );
        setRemark(
            attendance?.remark ?? ''
        );
        setStatus(
            attendance?.status ?? '未申請'
        );
    }, [
        attendance,
        targetDate,
        todayIn,
        todayOut
    ]);

    const handleSubmit = async () => {

        try {

            // まだレコードがない場合
            if (!attendance) {

                const response = await axios.post(
                    '/daily-attendance',
                    {
                        work_type: workType,
                        office: office,
                        start_time: startTime,
                        end_time: endTime,
                        transportation_fee: transportationFee,
                        remark: remark,
                    }
                );

                alert(response.data.message);

                router.reload();

            } else {

                // 申請状態切替
                const response = await axios.post(
                    `/daily-attendance/${attendance.id}/toggle-status`
                );

                setStatus(
                    response.data.status
                );
            }

        } catch (error) {

            console.log(error);

            alert('処理に失敗しました');
        }
    };

    return (
        <MainLayout>
            <Head title="日次勤怠登録" />
            <div
                key={targetDate}
                className="max-w-4xl mx-auto bg-white shadow rounded p-8"
            >
                <h1 className="text-3xl font-bold text-center mb-10">
                    日次勤怠登録画面
                </h1>

                {/* 氏名 */}
                <div className="mb-4">
                    <label className="font-bold">
                        氏名
                    </label>
                    <div>
                        {auth.user?.name}
                    </div>
                </div>

                {/* 社員番号 */}
                <div className="mb-4">
                    <label className="font-bold">
                        社員番号
                    </label>
                    <div>
                        T000{auth.user?.id}
                    </div>
                </div>

                {/* 日付 */}
                <div className="mb-4">
                    <label className="font-bold">
                        日付
                    </label>
                    <div>
                        {
                            targetDate
                                ? new Date(targetDate).toLocaleDateString(
                                    'ja-JP',
                                    {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'short',
                                    }
                                )
                                : ''
                        }
                    </div>
                </div>

                {/* 勤務区分 */}
                <div className="mb-4">
                    <label className="font-bold">
                        勤務区分
                    </label>
                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="border rounded w-full p-2"
                    >
                        <option>出勤</option>
                        <option>振出</option>
                        <option>欠勤</option>
                        <option>有給</option>
                        <option>特休</option>
                    </select>
                </div>

                {/* 打刻拠点 */}
                <div className="mb-4">
                    <label className="font-bold">
                        打刻拠点
                    </label>
                    <select
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                        className="border rounded w-full p-2"
                    >
                        <option>SES</option>
                        <option>社内業務</option>
                    </select>
                </div>

                {/* 出勤時刻 */}
                <div className="mb-4">
                    <label className="font-bold">
                        出勤時刻
                    </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* 退勤時刻 */}
                <div className="mb-4">
                    <label className="font-bold">
                        退勤時刻
                    </label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* 交通費 */}
                <div className="mb-4">
                    <label className="font-bold">
                        交通費
                    </label>
                    <input
                        type="number"
                        value={transportationFee}
                        onChange={(e) => setTransportationFee(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* 備考 */}
                <div className="mb-4">
                    <label className="font-bold">
                        備考
                    </label>
                    <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* 所属長コメント */}
                <div className="mb-4">
                    <label className="font-bold">
                        所属長コメント
                    </label>
                    <div>-</div>
                </div>

                {/* ステータス */}
                <div className="mb-8">
                    <label className="font-bold">
                        申請状況
                    </label>
                    <div>
                        {status}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        className={`
                            text-white
                            px-5
                            py-2
                            rounded
                            ${
                                status === '申請中'
                                    ? 'bg-red-500'
                                    : 'bg-green-500'
                            }
                        `}
                    >
                        {
                            status === '申請中'
                                ? '申請取消'
                                : '日次申請'
                        }
                    </button>
                    <button
                        className="
                            bg-blue-500
                            text-white
                            px-5
                            py-2
                            rounded
                        "
                    >
                        一括登録
                    </button>
                    <button
                        onClick={() => router.get('/attendances')}
                        className="
                            bg-gray-500
                            text-white
                            px-5
                            py-2
                            rounded
                        "
                    >
                        戻る
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}