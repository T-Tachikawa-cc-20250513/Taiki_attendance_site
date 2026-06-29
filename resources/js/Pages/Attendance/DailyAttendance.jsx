import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DailyAttendance({
    todayIn,
    todayOut,
    attendance,
    targetDate,
    isClosed,
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

    const [breakStartTime, setBreakStartTime] = useState(
        attendance?.break_start_time ?? ''
    );

    const [breakEndTime, setBreakEndTime] = useState(
        attendance?.break_end_time ?? ''
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

        setBreakStartTime(
            attendance?.break_start_time ?? ''
        );

        setBreakEndTime(
            attendance?.break_end_time ?? ''
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

    // 登録
    const handleSave = async () => {

        try {

            const response = await axios.post(
                '/daily-attendance/save',
                {
                    target_date: targetDate,
                    work_type: workType,
                    office: office,
                    start_time: startTime,
                    end_time: endTime,
                    break_start_time: breakStartTime,
                    break_end_time: breakEndTime,
                    transportation_fee: transportationFee,
                    remark: remark,
                }
            );

            alert(response.data.message);

            router.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '登録に失敗しました'
            );
        }
    };

    // 申請
    const handleApply = async () => {

        try {

            const response = await axios.post(
                '/daily-attendance/apply',
                {
                    target_date: targetDate,
                    work_type: workType,
                    office: office,
                    start_time: startTime,
                    end_time: endTime,
                    break_start_time: breakStartTime,
                    break_end_time: breakEndTime,
                    transportation_fee: transportationFee,
                    remark: remark,
                }
            );

            alert(response.data.message);

            router.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '申請に失敗しました'
            );
        }
    };

    // 申請取消
    const handleCancel = async () => {

        try {

            await axios.post(
                `/daily-attendance/${attendance.id}/toggle-status`
            );

            alert('申請を取消しました');

            router.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '申請取消に失敗しました'
            );
        }
    };

    const isHolidayType = [
        '公休'
    ].includes(workType);

    const isEditable =
        !isClosed &&
        (
            status === '未申請'
            || status === '差戻'
        );

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

                {isClosed && (
                    <div className="
                        mb-6
                        text-red-600
                        font-bold
                        bg-red-50
                        border
                        border-red-200
                        p-3
                        rounded
                    ">
                        ※この月は月締済のため編集できません
                    </div>
                )}

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
                        disabled={!isEditable}
                        className="border rounded w-full p-2"
                    >
                        <option>出勤</option>
                        <option>公休</option>
                    </select>
                </div>

                {!isHolidayType && (
                    <>
                        {/* 打刻拠点 */}
                        <div className="mb-4">
                            <label className="font-bold">
                                打刻拠点
                            </label>

                            <select
                                value={office}
                                onChange={(e) =>
                                    setOffice(e.target.value)
                                }
                                disabled={!isEditable}
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
                                onChange={(e) =>
                                    setStartTime(e.target.value)
                                }
                                disabled={!isEditable}
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
                                onChange={(e) =>
                                    setEndTime(e.target.value)
                                }
                                disabled={!isEditable}
                                className="border rounded p-2 w-full"
                            />
                        </div>

                        {/* 休憩時間 */}
                        <div className="mb-4">
                            <label className="font-bold">
                                休憩時間
                            </label>

                            <div className="flex items-center gap-3">

                                <input
                                    type="time"
                                    value={breakStartTime}
                                    onChange={(e) =>
                                        setBreakStartTime(
                                            e.target.value
                                        )
                                    }
                                    disabled={!isEditable}
                                    className="border rounded p-2"
                                />

                                <span>～</span>

                                <input
                                    type="time"
                                    value={breakEndTime}
                                    onChange={(e) =>
                                        setBreakEndTime(
                                            e.target.value
                                        )
                                    }
                                    disabled={!isEditable}
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
                                onChange={(e) =>
                                    setTransportationFee(
                                        Number(e.target.value)
                                    )
                                }
                                disabled={!isEditable}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    </>
                )}

                {/* 備考 */}
                <div className="mb-4">
                    <label className="font-bold">
                        備考
                    </label>

                    <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        disabled={!isEditable}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* 所属長コメント */}
                <div className="mb-4">
                    <label className="font-bold">
                        所属長コメント
                    </label>

                    <div className="border rounded p-3 bg-gray-50">
                        {attendance?.manager_comment ?? '-'}
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

                    {/* 登録 */}
                    {isEditable && (
                        <button
                            onClick={handleSave}
                            className="
                                bg-blue-500
                                text-white
                                px-5
                                py-2
                                rounded
                            "
                        >
                            登録
                        </button>
                    )}

                    {/* 申請 */}
                    {isEditable && (
                        <button
                            onClick={handleApply}
                            className="
                                bg-green-500
                                text-white
                                px-5
                                py-2
                                rounded
                            "
                        >
                            申請
                        </button>
                    )}

                    {/* 申請取消 */}
                    {
                        !isClosed &&
                        status === '申請中' && (
                            <button
                                onClick={handleCancel}
                                className="
                                    bg-red-500
                                    text-white
                                    px-5
                                    py-2
                                    rounded
                                "
                            >
                                申請取消
                            </button>
                        )
                    }

                    {/* 戻る */}
                    <button
                        onClick={() =>
                            router.get('/attendances')
                        }
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