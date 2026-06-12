import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function DailyAttendance({
    todayIn,
    todayOut,
    attendance
}) {

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

    const isSubmitted =
        status === '申請中'
        || status === '承認済';

    const { auth } = usePage().props;

    const handleSubmit = async () => {
        try {

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

            setStatus('申請中');

        } catch (error) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);
                alert(error.response.data);
            }

            alert('日次申請失敗');
        }
    };

    return (
        <MainLayout>
            <Head title="日次勤怠登録" />

            <div className="max-w-4xl mx-auto bg-white shadow rounded p-8">
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
                        {new Date().toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            weekday: 'short',
                        })}
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

                {/* 翌日チェック */}
                <div className="mb-4">
                    <label>
                        <input type="checkbox" />
                        <span className="ml-2">
                            翌日
                        </span>
                    </label>
                </div>

                {/* 休憩時間 */}
                <div className="mb-4">
                    <label className="font-bold">
                        休憩時間
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="time"
                            className="border rounded p-2"
                        />
                        <span>～</span>
                        <input
                            type="time"
                            className="border rounded p-2"
                        />
                    </div>
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
                    <div>
                        -
                    </div>
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
                        disabled={isSubmitted}
                        className={`
                            text-white
                            px-5
                            py-2
                            rounded
                            ${
                                isSubmitted
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500'
                            }
                        `}
                    >
                        日次申請
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