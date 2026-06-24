import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function AdminLeaveRequest({
    requests
}) {

    const approve = async (id) => {

        if (
            !confirm(
                '承認しますか？'
            )
        ) {
            return;
        }

        try {

            await axios.post(
                `/admin/leave-requests/${id}/approve`
            );

            alert(
                '承認しました'
            );

            location.reload();

        } catch (error) {

            console.log(error);

            alert(
                '承認に失敗しました'
            );
        }
    };

    const reject = async (id) => {

        const reason = prompt(
            '差戻理由を入力してください'
        );

        if (!reason) {
            return;
        }

        try {

            await axios.post(
                `/admin/leave-requests/${id}/reject`,
                {
                    reason: reason,
                }
            );

            alert(
                '差し戻しました'
            );

            location.reload();

        } catch (error) {

            console.log(error);

            alert(
                '差戻に失敗しました'
            );
        }
    };

    return (
        <AdminLayout>

            <Head title="届出承認画面" />

            <div
                className="
                    max-w-7xl
                    mx-auto
                    bg-white
                    p-8
                    shadow
                    rounded
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        mb-8
                    "
                >
                    届出承認画面
                </h1>

                <table
                    className="
                        w-full
                        border
                    "
                >

                    <thead
                        className="
                            bg-gray-200
                        "
                    >

                        <tr>

                            <th className="border p-2">
                                社員名
                            </th>

                            <th className="border p-2">
                                届出区分
                            </th>

                            <th className="border p-2">
                                対象日
                            </th>

                            <th className="border p-2">
                                理由
                            </th>

                            <th className="border p-2">
                                添付
                            </th>

                            <th className="border p-2">
                                状態
                            </th>

                            <th className="border p-2">
                                操作
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {requests.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="
                                        text-center
                                        py-6
                                    "
                                >
                                    承認待ちデータがありません
                                </td>

                            </tr>

                        ) : (

                            requests.map(
                                (request) => (

                                    <tr
                                        key={request.id}
                                    >

                                        <td className="border p-2">
                                            {
                                                request.user?.name
                                            }
                                        </td>

                                        <td className="border p-2">
                                            {
                                                request.request_type
                                            }
                                        </td>

                                        <td className="border p-2">
                                            {
                                                request.target_date
                                            }
                                        </td>

                                        <td className="border p-2">
                                            {
                                                request.reason
                                            }
                                        </td>

                                        <td className="border p-2">

                                            {
                                                request.image_path
                                                    ? (
                                                        <a
                                                            href={
                                                                `/storage/${request.image_path}`
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="
                                                                text-blue-600
                                                                underline
                                                            "
                                                        >
                                                            表示
                                                        </a>
                                                    )
                                                    : 'なし'
                                            }

                                        </td>

                                        <td className="border p-2">
                                            {
                                                request.status
                                            }
                                        </td>

                                        <td className="border p-2">

                                            {
                                                request.status === '申請中'
                                                && (
                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                approve(
                                                                    request.id
                                                                )
                                                            }
                                                            className="
                                                                bg-green-500
                                                                text-white
                                                                px-3
                                                                py-1
                                                                rounded
                                                            "
                                                        >
                                                            承認
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                reject(
                                                                    request.id
                                                                )
                                                            }
                                                            className="
                                                                bg-red-500
                                                                text-white
                                                                px-3
                                                                py-1
                                                                rounded
                                                            "
                                                        >
                                                            差戻
                                                        </button>

                                                    </div>
                                                )
                                            }

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