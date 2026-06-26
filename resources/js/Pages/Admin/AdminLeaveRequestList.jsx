import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

export default function AdminLeaveRequestList({
    requests,
    userId,
    status = '申請中',
}) {

    const changeStatus = (e) => {

        router.get(
            '/admin/leave-requests',
            {
                userId: userId,
                status: e.target.value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const approve = async (id) => {

        if (
            !confirm('承認しますか？')
        ) {
            return;
        }

        try {

            await axios.post(
                `/admin/leave-requests/${id}/approve`
            );

            alert('承認しました');

            location.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '承認に失敗しました'
            );
        }
    };

    const bulkApprove = async () => {

        if (
            !confirm('申請中の届出を一括承認しますか？')
        ) {
            return;
        }

        try {

            await axios.post(
                '/admin/leave-requests/bulk-approve',
                {
                    user_id: userId,
                }
            );

            alert('一括承認しました');

            location.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '一括承認に失敗しました'
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

            alert('差し戻しました');

            location.reload();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message
                ?? '差戻に失敗しました'
            );
        }
    };

    return (
        <AdminLayout
            showDashboardLink
            showLeaveRequestLink={false}
            showBackButton
        >

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

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-8
                    "
                >

                    <h1
                        className="
                            text-3xl
                            font-bold
                        "
                    >
                        届出承認画面
                    </h1>

                    <div className="flex gap-4">

                        <select
                            value={status}
                            onChange={changeStatus}
                            className="
                                border
                                p-2
                                rounded
                            "
                        >
                            <option value="申請中">
                                申請中
                            </option>

                            <option value="承認済">
                                承認済
                            </option>

                            <option value="差戻">
                                差戻
                            </option>

                            <option value="未申請">
                                未申請
                            </option>

                            <option value="すべて">
                                すべて
                            </option>

                        </select>

                        {requests.length > 0 && (
                            <button
                                onClick={bulkApprove}
                                className="
                                    bg-green-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded
                                "
                            >
                                一括承認
                            </button>
                        )}

                    </div>

                </div>

                <table
                    className="
                        w-full
                        border
                    "
                >

                    <thead className="bg-gray-200">

                        <tr>

                            <th className="border p-2">
                                申請日時
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
                                    届出データがありません
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
                                                new Date(request.created_at)
                                                    .toLocaleString(
                                                        'ja-JP',
                                                        {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        }
                                                    )
                                            }
                                        </td>

                                        <td className="border p-2">
                                            {request.request_type}
                                        </td>

                                        <td className="border p-2">
                                            {request.start_date}
                                        </td>

                                        <td className="border p-2">
                                            {request.reason}
                                        </td>

                                        <td className="border p-2">

                                            {request.attachment_path ? (

                                                <a
                                                    href={`/storage/${request.attachment_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="
                                                        text-blue-600
                                                        underline
                                                    "
                                                >
                                                    表示
                                                </a>

                                            ) : 'なし'}

                                        </td>

                                        <td className="border p-2">
                                            {request.status}
                                        </td>

                                        <td className="border p-2">

                                            {request.status === '申請中' && (

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