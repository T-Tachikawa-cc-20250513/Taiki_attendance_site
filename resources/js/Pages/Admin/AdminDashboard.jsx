import { router } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout
    from '@/Layouts/AdminLayout';

export default function AdminDashboard({
    users = [],
}) {

    const closeMonth = async () => {

        const month = prompt(
            '月締対象を入力してください（例：2026-06）'
        );

        if (!month) {
            return;
        }

        if (
            !confirm(
                `${month} を月締しますか？`
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

            alert('月締が完了しました');

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '月締に失敗しました'
            );
        }
    };

    return (
        <AdminLayout>

            <div className="p-8">

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    "
                >

                    <h1
                        className="
                            text-3xl
                            font-bold
                        "
                    >
                        管理者ダッシュボード
                    </h1>

                    <button
                        onClick={closeMonth}
                        className="
                            bg-red-500
                            text-white
                            px-4
                            py-2
                            rounded
                            hover:bg-red-600
                        "
                    >
                        月締処理
                    </button>

                </div>

                <div className="grid gap-4">

                    {users.map((user) => (

                        <button
                            key={user.id}
                            onClick={() =>
                                router.get(
                                    `/admin/user/${user.id}`
                                )
                            }
                            className="
                                border
                                rounded
                                p-4
                                text-left
                                hover:bg-gray-100
                            "
                        >

                            <div className="font-bold">
                                {user.name}
                            </div>

                            <div>
                                社員番号：
                                T000{user.id}
                            </div>

                        </button>

                    ))}

                </div>

            </div>

        </AdminLayout>
    );
}