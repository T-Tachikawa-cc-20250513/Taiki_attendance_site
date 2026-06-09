import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout';

export default function Punch({
        lastPunchType,
        todayIn,
        todayOut
    }){
    const [currentTime, setCurrentTime] = useState(new Date());

    const { auth } = usePage().props;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePunch = async (type) => {
        try {
            await axios.post('/punch', {
                punch_type: type,
            });
            router.reload();
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <MainLayout>
            <Head title="打刻画面" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <div className="mb-6 text-center">
                        <p className="text-gray-500">社員番号</p>
                        <p className="text-xl font-semibold">
                            T000{auth.user?.id}
                        </p>
                    </div>
                    <div className="mb-6 text-center">
                        <p className="text-gray-500">氏名</p>
                        <p className="text-xl font-semibold">
                            {auth.user?.name}
                        </p>
                    </div>
                    <div className="mb-8 text-center">
                        <p className="text-gray-500 mb-2">
                            現在日時
                        </p>
                        <p className="text-2xl font-bold">
                            {currentTime.toLocaleDateString()}
                        </p>
                        <p className="text-4xl font-bold mt-2">
                            {currentTime.toLocaleTimeString()}
                        </p>
                    </div>

                    <div className="mb-6">

                        <div className="mb-3 text-center">
                            <p className="text-gray-500">
                                本日の出勤時刻
                            </p>

                            <p className="text-xl font-semibold">
                                {todayIn
                                    ? new Date(todayIn).toLocaleTimeString(
                                        'ja-JP',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )
                                    : '--:--'}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500">
                                本日の退勤時刻
                            </p>

                            <p className="text-xl font-semibold">
                                {todayOut
                                    ? new Date(todayOut).toLocaleTimeString(
                                        'ja-JP',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )
                                    : '--:--'}
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <button
                            onClick={() => handlePunch('IN')}
                            disabled={lastPunchType === 'IN'}
                            className="
                                bg-blue-500
                                hover:bg-blue-600
                                disabled:bg-gray-400
                                text-white
                                py-3
                                rounded-lg
                                font-bold
                            "
                        >
                            出勤
                        </button>

                        <button
                            onClick={() => handlePunch('OUT')}
                            disabled={lastPunchType === 'OUT'}
                            className="
                                bg-red-500
                                hover:bg-red-600
                                disabled:bg-gray-400
                                text-white
                                py-3
                                rounded-lg
                                font-bold
                            "
                        >
                            退勤
                        </button>

                    </div>

                </div>
            </div>
        </MainLayout>
    );
}