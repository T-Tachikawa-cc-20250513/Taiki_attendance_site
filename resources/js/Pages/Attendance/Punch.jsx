import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Punch() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePunch = async (type) => {
        try {
            const response = await axios.post('/punch', {
                punch_type: type,
            });

            alert(response.data.message);
        } catch (error) {
            alert('打刻失敗');
        }
    };

    return (
        <>
            <Head title="打刻画面" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        勤怠管理システム
                    </h1>
                    <div className="mb-6 text-center">
                        <p className="text-gray-500">社員番号</p>
                        <p className="text-xl font-semibold">
                            000001
                        </p>
                    </div>
                    <div className="mb-6 text-center">
                        <p className="text-gray-500">氏名</p>
                        <p className="text-xl font-semibold">
                            テストユーザー
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

                    <div className="grid grid-cols-2 gap-4">

                        <button
                            onClick={() => handlePunch('IN')}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold"
                        >
                            出勤
                        </button>

                        <button
                            onClick={() => handlePunch('OUT')}
                            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold"
                        >
                            退勤
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}